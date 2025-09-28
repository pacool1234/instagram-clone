import { Request, Response } from "express";
import Post from "../models/Post.js";
import { IComment } from "../domain/interfaces.js";

export const createPost = async (req: Request, res: Response) => {
  const { imageUrl, caption } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  const post = await Post.create({
    imageUrl,
    caption,
    author: req.user?._id,
  });

  res.status(201).json(post);
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 });

  res.json(posts);
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user!._id;

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await post.updateOne({ $pull: { likes: userId } });
      res.json({ message: "Post unliked" });
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.json({ message: "Post liked" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text,
      user: req.user!._id,
    } as IComment;

    post.comments.unshift(newComment);

    await post.save();

    await post.populate('comments.user', 'username');

    res.status(201).json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
