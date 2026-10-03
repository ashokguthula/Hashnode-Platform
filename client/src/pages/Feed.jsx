import { useEffect, useState } from "react";
import api from "../api/axios";
import PostList from "../components/post/PostList";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ErrorMessage from "../components/layout/ErrorMessage";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPosts = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/posts", {
                params: searchValue
                    ? { search: searchValue }
                    : {},
            });

            setPosts(response.data.posts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load posts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        fetchPosts(search.trim());
    };

    return (
        <main className="feed-page">
            <section className="feed-hero">
                <p className="eyebrow">DEVELOPER PUBLISHING PLATFORM</p>

                <h1>Share what you build.</h1>

                <p className="feed-description">
                    Write technical articles, share your knowledge,
                    and discover what other developers are building.
                </p>

                <form
                    className="search-form"
                    onSubmit={handleSearch}
                >
                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search articles by title..."
                    />

                    <button type="submit">
                        Search
                    </button>
                </form>
            </section>

            <section className="feed-section">
                <div className="section-heading">
                    <div>
                        <h2>Latest articles</h2>
                        {!loading && !error && (
                            <p>
                                {posts.length}{" "}
                                {posts.length === 1
                                    ? "article"
                                    : "articles"}
                            </p>
                        )}
                    </div>
                </div>

                {loading && (
                    <LoadingSpinner message="Loading articles..." />
                )}

                <ErrorMessage message={error} />

                {!loading && !error && (
                    <PostList posts={posts} />
                )}
            </section>
        </main>
    );
}

export default Feed;