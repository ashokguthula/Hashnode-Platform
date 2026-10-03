import { Link } from "react-router-dom";

function TagPill({ tag }) {
    return (
        <Link
            className="tag-pill"
            to={`/tag/${tag.slug}`}
        >
            #{tag.name}
        </Link>
    );
}

export default TagPill;