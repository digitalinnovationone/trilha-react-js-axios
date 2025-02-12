import { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import { usePosts } from "../../hooks/usePosts";

const Posts: React.FC = () => {
  const { posts, loading, addPost, deletePost, editPost } = usePosts();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userFullName, setUserFullName] = useState("Anonymous");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getAuthenticatedUserName = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) throw new Error("User token not found");

        const res = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserFullName(`${res.data.firstName} ${res.data.lastName}`);
      } catch {
        alert("Error fetching user data");
      }
    };

    getAuthenticatedUserName();
  }, [API_URL]);

  const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addPost(title, body, 5);
    setTitle("");
    setBody("");
  };

  return (
    <div>
      <h1 className="text-2xl mb-5">Hello, {userFullName}</h1>
      <form className="mb-10" onSubmit={handleAddPost}>
        <input
          className="w-full mb-2 p-2 border rounded border-gray-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="w-full mb-2 p-2 border rounded border-gray-200"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white p-2 rounded pl-5 pr-5 w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Post"}
        </button>
      </form>
      {loading && <p>Loading posts...</p>}
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          body={post.body}
          onDelete={deletePost}
          onEdit={editPost}
        />
      ))}
    </div>
  );
};

export default Posts;

