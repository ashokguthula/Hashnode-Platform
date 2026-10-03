import PostCard from "./PostCard";

function PostList({ posts }) {
    if (posts.length === 0) {
        return (
            <div className="empty-state">
                <h3>No articles found</h3>
                <p>
                    Try a different search term or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="post-list">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                />
            ))}
        </div>
    );
}

export default PostList;