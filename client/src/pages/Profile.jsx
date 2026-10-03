import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import PostList from "../components/post/PostList";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ErrorMessage from "../components/layout/ErrorMessage";

function Profile() {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/users/${id}`);

                setUser(response.data.user);
                setPosts(response.data.posts);
            } catch (error) {
                console.error("Failed to fetch profile:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    if (error) {
        return (
            <main>
                <ErrorMessage message={error} />
                <Link to="/">Back to Feed</Link>
            </main>
        );
    }

    return (
        <main>
            <Link to="/">← Back to Feed</Link>

            {user.avatarUrl && (
                <img
                    src={user.avatarUrl}
                    alt={user.name}
                    width="120"
                />
            )}

            <h1>{user.name}</h1>

            <p>
                {user.bio || "No bio available."}
            </p>

            <h2>Published Posts</h2>

            <PostList posts={posts} />
        </main>
    );
}

export default Profile;