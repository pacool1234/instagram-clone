import API from "./api";

export const addPost = (imageUrl: string, caption: string) => {
  return API.post("/posts", { imageUrl, caption });
};

export const getPosts = () => API.get("/posts");
