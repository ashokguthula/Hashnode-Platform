const Post = require("../models/Post");
const Tag = require("../models/Tags");

// Find existing tags or create new ones
const resolveTags = async (tagNames = []) => {
    const tagIds = [];

    for (const tagName of tagNames) {
        const cleanName = tagName.trim().toLowerCase();

        if (!cleanName) {
            continue;
        }

        const slug = cleanName
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        let tag = await Tag.findOne({ slug });

        if (!tag) {
            tag = await Tag.create({
                name: cleanName,
                slug,
            });
        }

        tagIds.push(tag._id);
    }

    return tagIds;
};

// Create a new post
const createPost = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            coverImage,
            status,
            tags,
        } = req.body;

        // 1. Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        // 2. Generate a slug from the title
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        // 3. Check whether the slug already exists
        const existingPost = await Post.findOne({ slug });

        if (existingPost) {
            return res.status(409).json({
                message: "A post with this title already exists",
            });
        }

        const tagIds = await resolveTags(tags);


        // 4. Create the post
        const post = await Post.create({
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status: status || "draft",
            author: req.user.userId,
            tags: tagIds,
        });

        // 5. Return the created post
        return res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Create post error:", error.message);

        return res.status(500).json({
            message: "Server error while creating post",
        });
    }
};

// Get all published posts
const getPublishedPosts = async (req, res) => {
    try {
        const { search, tag } = req.query;

        const filter = {
            status: "published",
        };

        // Search by post title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i",
            };
        }

        // Filter by tag
        if (tag) {
            const Tag = require("../models/Tag");

            const foundTag = await Tag.findOne({
                slug: tag.toLowerCase(),
            });

            if (!foundTag) {
                return res.status(200).json({
                    posts: [],
                });
            }

            filter.tags = foundTag._id;
        }

        const posts = await Post.find(filter)
            .populate("author", "name avatarUrl")
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error("Get published posts error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching posts",
        });
    }
};
// Get a single published post by slug
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await Post.findOne({
            slug,
            status: "published",
        })
            .populate("author", "name bio avatarUrl")
            .populate("tags", "name slug");

        if (!post) {
            return res.status(404).json({
                message: "Published post not found",
            });
        }

        return res.status(200).json({
            post,
        });
    } catch (error) {
        console.error("Get post by slug error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching post",
        });
    }
};
// Update a post owned by the logged-in user
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            content,
            excerpt,
            coverImage,
            status,
            tags,
        } = req.body;

        // 1. Find the post
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // 2. Check ownership
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this post",
            });
        }

        // 3. Update fields that were provided
        if (title !== undefined) {
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        if (excerpt !== undefined) {
            post.excerpt = excerpt;
        }

        if (coverImage !== undefined) {
            post.coverImage = coverImage;
        }

        if (status !== undefined) {
            post.status = status;
        }

        if (tags !== undefined) {
            post.tags = await resolveTags(tags);
        }

        // 4. Regenerate slug when title changes
        if (title !== undefined) {
            const newSlug = title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

            const existingPost = await Post.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });

            if (existingPost) {
                return res.status(409).json({
                    message: "A post with this title already exists",
                });
            }

            post.slug = newSlug;
        }

        // 5. Save the updated post
        const updatedPost = await post.save();

        return res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Update post error:", error.message);

        return res.status(500).json({
            message: "Server error while updating post",
        });
    }
};
// Delete a post owned by the logged-in user
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find the post
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // 2. Check ownership
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this post",
            });
        }

        // 3. Delete the post
        await post.deleteOne();

        return res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Delete post error:", error.message);

        return res.status(500).json({
            message: "Server error while deleting post",
        });
    }
};
// Get all posts created by the logged-in user
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            author: req.user.userId,
        })
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error("Get my posts error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching your posts",
        });
    }
};
module.exports = {
    createPost,
    getPublishedPosts,
    getPostBySlug,
    updatePost,
    deletePost,
    getMyPosts,
};