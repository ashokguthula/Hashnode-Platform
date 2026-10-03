import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ErrorMessage from "../components/layout/ErrorMessage";

function Tags() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/tags");

                setTags(response.data.tags);
            } catch (error) {
                console.error("Failed to fetch tags:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load tags."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (loading) {
        return (
            <LoadingSpinner message="Loading tags..." />
        );
    }

    return (
        <main>
            <h1>Explore Tags</h1>

            <ErrorMessage message={error} />

            {!error && tags.length === 0 && (
                <p>No tags available yet.</p>
            )}

            {!error && tags.length > 0 && (
                <div>
                    {tags.map((tag) => (
                        <article key={tag.id}>
                            <h2>
                                <Link to={`/tag/${tag.slug}`}>
                                    #{tag.name}
                                </Link>
                            </h2>

                            <p>
                                {tag.postCount}{" "}
                                {tag.postCount === 1
                                    ? "published post"
                                    : "published posts"}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Tags;