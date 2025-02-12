import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const getPosts = async () => {
  const res = await api.get("/posts");
  return res.data.posts;
};

export const createPost = async (
  title: string,
  body: string,
  userId: number
) => {
  const res = await api.post("/posts/add", {
    title,
    body,
    userId,
  });

  return res.data;
};

export const updatePost = async (id: number, title: string, body: string) => {
  const res = await api.put(`/posts/${id}`, {
    title,
    body,
  });

  return res.data;
};

export const deletePost = async (id: number) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

