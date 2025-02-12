import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

interface Post {
  id: number;
  title: string;
  body: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/posts");
        setPosts(res.data.posts);
      } catch {
        alert("Error fetching posts");
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (title: string, body: string, userId: number) => {
    try {
      const res = await api.post("/posts/add", { title, body, userId });
      setPosts((prev) => [res.data, ...prev]);
    } catch {
      alert("Error adding post");
      setError("Error adding post");
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch {
      alert(`Error deleting post ${id}`);
      setError(`Error deleting post ${id}`);
    }
  };

  const editPost = async (id: number, title: string, body: string) => {
    if (!confirm("Are you sure you want to edit this post?")) return;

    try {
      const res = await api.put(`/posts/${id}`, { id, title, body });
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? res.data : post))
      );
    } catch {
      alert(`Error editing post ${id}`);
      setError(`Error editing post ${id}`);
    }
  };

  return { posts, loading, error, addPost, deletePost, editPost };
};

