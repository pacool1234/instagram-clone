import { createContext, useReducer } from "react";
import { type IProviderProps } from "../../domain/interfaces.js";
import PostReducer, { type StateType, ACTION_TYPES } from "./PostReducer.ts";
import { getPosts, addPost } from "../../services/post.api.js";

const initialState: StateType = {
  posts: [],
};

type PostContextType = StateType & {
  fetchPosts: () => Promise<void>;
	createPost: (imageUrl: string, caption: string) => Promise<void>;
};

export const PostContext = createContext<PostContextType | undefined>(undefined);

export const AuthProvider = ({ children }: IProviderProps) => {
  const [state, dispatch] = useReducer(PostReducer, initialState);

  const fetchPosts = async () => {
    const res = await getPosts();

    if (res.data) {
      dispatch({
        type: ACTION_TYPES.GetPosts,
        payload: { posts: res.data },
      });
    }
  };

  const createPost = async (imageUrl: string, caption: string) => {
    try {
      const res = await addPost(imageUrl, caption);

      if (res.data) {
        dispatch({
          type: ACTION_TYPES.CreatePost,
          payload: { post: res.data },
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts: state.posts,
				createPost,
				fetchPosts
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
