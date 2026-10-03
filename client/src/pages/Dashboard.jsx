import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ErrorMessage from "../components/layout/ErrorMessage";

function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/posts/mine");

            setPosts(response.data.posts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load your posts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/posts/${postId}`);

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post._id !== postId)
            );
        } catch (error) {
            console.error("Failed to delete post:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete the post."
            );
        }
    };

    if (loading) {
        return (
            <main>
                <LoadingSpinner message="Loading your dashboard..." />
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <div>
                    <p className="eyebrow">YOUR WORKSPACE</p>
                    <h1>Dashboard</h1>
                    <p>
                        Manage your drafts and published articles.
                    </p>
                </div>

                <Link
                    className="primary-button"
                    to="/editor/new"
                >
                    + New Post
                </Link>
            </section>

            <ErrorMessage message={error} />

            {posts.length === 0 ? (
                <section className="empty-state dashboard-empty">
                    <h2>No posts yet</h2>

                    <p>
                        Start writing your first technical article.
                    </p>

                    <Link
                        className="primary-button"
                        to="/editor/new"
                    >
                        Create Your First Post
                    </Link>
                </section>
            ) : (
                <section className="dashboard-posts">
                    {posts.map((post) => (
                        <article
                            className="dashboard-post"
                            key={post._id}
                        >
                            <div className="dashboard-post-info">
                                <div className="post-meta">
                                    <span>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                <h2>
                                    {post.title}
                                </h2>

                                <p>
                                    {post.excerpt ||
                                        "No excerpt available."}
                                </p>

                                <span
                                    className={`status-badge ${post.status}`}
                                >
                                    {post.status === "published"
                                        ? "Published"
                                        : "Draft"}
                                </span>
                            </div>

                            <div className="dashboard-actions">
                                <Link
                                    className="secondary-button"
                                    to={`/editor/${post._id}`}
                                >
                                    Edit
                                </Link>

                                {post.status === "published" && (
                                    <Link
                                        className="secondary-button"
                                        to={`/post/${post.slug}`}
                                    >
                                        View
                                    </Link>
                                )}

                                <button
                                    className="danger-button"
                                    type="button"
                                    onClick={() =>
                                        handleDelete(post._id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default Dashboard;