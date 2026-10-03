import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import MarkdownPreview from "../components/editor/MarkdownPreview";
import TagPill from "../components/post/TagPill";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ErrorMessage from "../components/layout/ErrorMessage";

function PostDetail() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/posts/${slug}`);

                setPost(response.data.post);
            } catch (error) {
                console.error("Failed to fetch post:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load the article."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <main>
                <LoadingSpinner message="Loading article..." />
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <ErrorMessage message={error} />
                <Link to="/">← Back to Feed</Link>
            </main>
        );
    }

    if (!post) {
        return (
            <main>
                <ErrorMessage message="Article not found." />
                <Link to="/">← Back to Feed</Link>
            </main>
        );
    }

    const publishedDate = new Date(
        post.createdAt
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <main className="post-detail-page">
            <Link className="back-link" to="/">
                ← Back to Feed
            </Link>

            <article className="post-detail">
                {post.coverImage && (
                    <img
                        className="post-detail-cover"
                        src={post.coverImage}
                        alt={post.title}
                    />
                )}

                <header className="post-detail-header">
                    <div className="post-detail-meta">
                        <span>{publishedDate}</span>
                    </div>

                    <h1>{post.title}</h1>

                    {post.excerpt && (
                        <p className="post-detail-excerpt">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="author-info">
                        {post.author?.avatarUrl && (
                            <img
                                src={post.author.avatarUrl}
                                alt={post.author.name}
                                width="48"
                                height="48"
                            />
                        )}

                        <div>
                            <p>Written by</p>

                            <Link
                                to={`/profile/${post.author._id}`}
                            >
                                {post.author.name}
                            </Link>
                        </div>
                    </div>

                    {post.tags?.length > 0 && (
                        <div className="post-detail-tags">
                            {post.tags.map((tag) => (
                                <TagPill
                                    key={tag._id}
                                    tag={tag}
                                />
                            ))}
                        </div>
                    )}
                </header>

                <div className="post-content">
                    <MarkdownPreview
                        content={post.content}
                    />
                </div>
            </article>
        </main>
    );
}

export default PostDetail;