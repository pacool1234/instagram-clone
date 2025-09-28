import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    passwordHash,
  });

  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const bulkInsert = async (req: Request, res: Response) => {
  function generateMockUsers() {
    const mockUsers = [];
    const basePassword = "Password123!";

    const adjectives = [
      "Aggressive",
      "Bouncy",
      "Curious",
      "Dizzy",
      "Eager",
      "Fancy",
      "Gentle",
      "Happy",
      "Itchy",
      "Jolly",
      "Silent",
      "Jumping",
      "Fit",
      "Epic",
      "Giant",
      "Tiny",
      "Clever",
      "Witty",
      "Furious",
      "Calm",
      "Brave",
      "Golden",
      "Electric",
      "Frozen",
      "Wild",
      "Misty",
      "Velvet",
      "Iron",
      "Neon",
      "Quantum",
      "Solar",
      "Sharp",
      "Royal",
    ];

    const nouns = [
      "Cry",
      "Television",
      "Banana",
      "Cat",
      "Dog",
      "Eagle",
      "Falcon",
      "Galaxy",
      "Hawk",
      "Ice",
      "Lion",
      "Tiger",
      "Panther",
      "Shark",
      "Wolf",
      "Dragon",
      "Phoenix",
      "Fire",
      "Storm",
      "Stone",
      "Tree",
      "River",
      "Wizard",
      "Knight",
      "Whisper",
      "Cloud",
      "Thunder",
      "Lightning",
      "Blaze",
      "Ember",
      "Frost",
      "Phantom",
      "Shadow",
      "Forge",
      "Glitch",
      "Symphony",
      "Echo",
      "Comet",
      "Vortex",
      "Quasar",
      "Pixel",
    ];

    const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const getRandomNumber = () => {
      const num = Math.floor(Math.random() * 999) + 1;
      return String(num).padStart(3, "0");
    };

    for (let i = 1; i <= 100; i++) {
      const randomUsername = `${getRandomItem(adjectives)}${getRandomItem(nouns)}_${getRandomNumber()}`;

      const seqId = String(i).padStart(3, "0");

      mockUsers.push({
        username: randomUsername,
        email: `user${seqId}@testcorp.com`,
        password: basePassword,
      });
    }

    return mockUsers;
  }
  const usersToInsert = generateMockUsers();

  const users = usersToInsert;

  const userDataArray = [];

  for (const userData of users) {
    const { username, email, password } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) {
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    userDataArray.push({ username, email, passwordHash });
  }

  const result = await User.insertMany(userDataArray);

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (passwordsMatch) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const fetchUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-passwordHash");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
};

export const fetchProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });

  const postsByUser = await Post.find({ author: user._id }).populate("author", "username").sort({ createdAt: -1 });

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    posts: postsByUser,
  });
};

export const searchUserByQuery = async (req: Request, res: Response) => {
  const { query } = req.params;

  const users = await User.aggregate([
    {
      $search: {
        index: "userSearchIndex",
        autocomplete: {
          query: query,
          path: "username",
          fuzzy: { maxEdits: 1 },
        },
      },
    },
    { $limit: 10 },
    { $project: { _id: 1, username: 1, email: 1 } },
  ]);

  res.json({ users, query });
};
