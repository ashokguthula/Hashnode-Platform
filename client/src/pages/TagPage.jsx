import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import PostList from "../components/post/PostList";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ErrorMessage from "../components/layout/ErrorMessage";

function TagPage() {
    const { slug } = useParams();

    const [tag, setTag] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTagPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/tags/${slug}/posts`
                );

                setTag(response.data.tag);
                setPosts(response.data.posts);
            } catch (error) {
                console.error("Failed to fetch tag posts:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load tag posts."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTagPosts();
    }, [slug]);

    if (loading) {
        return <LoadingSpinner message="Loading tag..." />;
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

            <h1>
                #{tag?.name}
            </h1>

            <p>
                {posts.length} published{" "}
                {posts.length === 1 ? "post" : "posts"}
            </p>

            <PostList posts={posts} />
        </main>
    );
}

export default TagPage;