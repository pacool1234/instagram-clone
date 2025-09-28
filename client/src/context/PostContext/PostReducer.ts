import { type IPost } from "../../domain/interfaces.js";

export enum ACTION_TYPES {
	GetPosts = "getPosts",
	CreatePost = "createPost",
}

export type StateType = {
	posts: IPost[];
};

export type Actions =
	| { type: ACTION_TYPES.GetPosts; payload: { posts: IPost[] } }
	| { type: ACTION_TYPES.CreatePost; payload: { post: IPost } }

const post = (state: StateType, action: Actions) => {
	switch (action.type) {
		case ACTION_TYPES.GetPosts:
			return {
				posts: action.payload.posts,
			};

		default:
			return state;
	}
};

export default post;
