import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import MarkdownEditor from "../components/editor/MarkdownEditor";

function PostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [tags, setTags] = useState("");
    const [status, setStatus] = useState("draft");

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Load the existing post when editing
    useEffect(() => {
        if (!isEditing) {
            return;
        }

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/posts/mine");

                const existingPost = response.data.posts.find(
                    (post) => post._id === id
                );

                if (!existingPost) {
                    setError("Post not found.");
                    return;
                }

                setTitle(existingPost.title);
                setContent(existingPost.content);
                setExcerpt(existingPost.excerpt || "");
                setCoverImage(existingPost.coverImage || "");
                setStatus(existingPost.status);

                setTags(
                    existingPost.tags
                        .map((tag) => tag.name)
                        .join(", ")
                );
            } catch (error) {
                console.error("Failed to load post:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load the post."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, isEditing]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");

        const tagNames = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        const postData = {
            title,
            content,
            excerpt,
            coverImage,
            status,
            tags: tagNames,
        };

        try {
            if (isEditing) {
                await api.put(`/posts/${id}`, postData);
            } else {
                await api.post("/posts", postData);
            }

            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to save post:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save the post."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading post...</p>;
    }

    return (
        <main className="editor-page">
            <header className="editor-header">
                <p className="eyebrow">
                    {isEditing ? "EDIT ARTICLE" : "NEW ARTICLE"}
                </p>

                <h1>
                    {isEditing ? "Edit Post" : "Create New Post"}
                </h1>

                <p>
                    Write your article in Markdown and preview it live.
                </p>
            </header>
            {error && <p>{error}</p>}

            <form
                className="editor-form"
                onSubmit={handleSubmit}
            >
                <div>
                    <label htmlFor="title">
                        Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="excerpt">
                        Excerpt
                    </label>

                    <textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(event) =>
                            setExcerpt(event.target.value)
                        }
                        maxLength={250}
                        placeholder="A short description of your article"
                        rows={3}
                    />
                </div>

                <div>
                    <label htmlFor="coverImage">
                        Cover Image URL
                    </label>

                    <input
                        id="coverImage"
                        type="url"
                        value={coverImage}
                        onChange={(event) =>
                            setCoverImage(event.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label htmlFor="tags">
                        Tags
                    </label>

                    <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(event) =>
                            setTags(event.target.value)
                        }
                        placeholder="javascript, mongodb, express"
                    />

                    <p>
                        Separate multiple tags with commas.
                    </p>
                </div>

                <section className="editor-content-section">
                    <MarkdownEditor
                        value={content}
                        onChange={setContent}
                    />
                </section>

                <div className="editor-footer">
                    <div>
                        <label htmlFor="status">
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>
                        </select>
                    </div>
                

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : isEditing
                                ? "Update Post"
                                : "Create Post"}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default PostEditor;