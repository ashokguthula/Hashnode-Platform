import { Link } from "react-router-dom";
import TagPill from "./TagPill";

function PostCard({ post }) {
    const formattedDate = new Date(
        post.createdAt
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <article className="post-card">
            {post.coverImage && (
                <Link to={`/post/${post.slug}`}>
                    <img
                        className="post-card-image"
                        src={post.coverImage}
                        alt={post.title}
                    />
                </Link>
            )}

            <div className="post-card-content">
                <div className="post-meta">
                    <Link
                        className="author-link"
                        to={`/profile/${post.author._id}`}
                    >
                        {post.author.name}
                    </Link>

                    <span>•</span>

                    <span>{formattedDate}</span>
                </div>

                <h2 className="post-card-title">
                    <Link to={`/post/${post.slug}`}>
                        {post.title}
                    </Link>
                </h2>

                <p className="post-card-excerpt">
                    {post.excerpt ||
                        "Read this article to learn more."}
                </p>

                {post.tags?.length > 0 && (
                    <div className="post-tags">
                        {post.tags.map((tag) => (
                            <TagPill
                                key={tag._id}
                                tag={tag}
                            />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

export default PostCard;