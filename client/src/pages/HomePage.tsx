import { useState, useEffect } from "react";
import { getPosts } from "../services/post.api.js";
import { type IPost } from "../domain/interfaces.js";
import Button from "react-bootstrap/Button";

import PostItem from "../components/PostItem.js";
import CreatePostModal from "../components/CreatePostModal.js";

export default function HomePage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();

        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <div className="position-fixed" style={{ zIndex: 1000, top: "5rem", left: "1rem" }}>
        <Button variant="primary" onClick={handleShow}>
          Create post
        </Button>
      </div>

      <div className="posts-container d-flex flex-column align-items-center gap-4 mt-4">
        {posts.map((post) => {
          return <PostItem key={post._id} item={post} />;
        })}
      </div>

			<CreatePostModal show={show} handleClose={handleClose} />
    </>
  );
}
