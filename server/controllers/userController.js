const User = require("../models/User");
const Post = require("../models/Post");

// Get a public user profile
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user
        const user = await User.findById(id).select(
            "name bio avatarUrl"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Get only published posts by this user
        const posts = await Post.find({
            author: id,
            status: "published",
        })
            .populate("tags", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            user,
            posts,
        });
    } catch (error) {
        console.error("Get user profile error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching profile",
        });
    }
};

// Update the logged-in user's profile
const updateMyProfile = async (req, res) => {
    try {
        const { name, bio, avatarUrl } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Update only fields that were provided
        if (name !== undefined) {
            user.name = name;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (avatarUrl !== undefined) {
            user.avatarUrl = avatarUrl;
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                avatarUrl: updatedUser.avatarUrl,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error.message);

        return res.status(500).json({
            message: "Server error while updating profile",
        });
    }
};

module.exports = {
    getUserProfile,
    updateMyProfile,
};