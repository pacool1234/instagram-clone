import { useState, useEffect, useContext } from "react";
import { getProfile } from "../services/user.api.js";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext/UserState";
import { type IUser } from "../domain/interfaces.js";

import PostItem from "../components/PostItem.js";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("This component must be used within an AuthProvider");
  }

  const { users } = userContext;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) {
        setError("No user ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile(id);
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const existingUser = users.find((u) => u._id === id);

    if (existingUser) {
      setUser(existingUser);
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h1>User Profile</h1>
      {user ? (
        <>
          <div>
            <h2>{user.username}</h2>
            <p>Email: {user.email}</p>
          </div>

          <div className="posts-container d-flex flex-column align-items-center gap-4 mt-4">
            {user.posts?.map((post) => {
              return <PostItem key={post._id} item={post} />;
            })}
          </div>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
}
