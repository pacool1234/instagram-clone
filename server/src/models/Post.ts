import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User.js";

export interface IComment {
  user: IUser["_id"];
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: IUser["_id"];
  imageUrl: string;
  caption: string;
  likes: IUser["_id"][];
  comments: IComment[];
}

const PostSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>("Post", PostSchema);
