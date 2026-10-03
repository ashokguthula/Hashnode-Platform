const Tag = require("../models/Tags");
const Post = require("../models/Post");

// Get all tags with post counts
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ name: 1 });

        const tagsWithCounts = await Promise.all(
            tags.map(async (tag) => {
                const postCount = await Post.countDocuments({
                    tags: tag._id,
                    status: "published",
                });

                return {
                    id: tag._id,
                    name: tag.name,
                    slug: tag.slug,
                    postCount,
                };
            })
        );

        return res.status(200).json({
            count: tagsWithCounts.length,
            tags: tagsWithCounts,
        });
    } catch (error) {
        console.error("Get all tags error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching tags",
        });
    }
};

// Get published posts under a specific tag
const getPostsByTag = async (req, res) => {
    try {
        const { slug } = req.params;

        const tag = await Tag.findOne({
            slug: slug.toLowerCase(),
        });

        if (!tag) {
            return res.status(404).json({
                message: "Tag not found",
            });
        }

        const posts = await Post.find({
            status: "published",
            tags: tag._id,
        })
            .populate("author", "name avatarUrl")
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            tag: {
                id: tag._id,
                name: tag.name,
                slug: tag.slug,
            },
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error("Get posts by tag error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching posts by tag",
        });
    }
};

module.exports = {
    getAllTags,
    getPostsByTag,
};