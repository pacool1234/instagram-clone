import type { ReactNode } from "react";

export interface IComment {
  _id: string;
  text: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  token?: string;
	posts?: IPost[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  _id: string;
  author: {
    _id: string;
    username: string;
  };
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends ILoginRequest {
  username: string;
}
export interface IProviderProps {
  children: ReactNode;
}
