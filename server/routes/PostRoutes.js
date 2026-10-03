const express = require("express");
const { createPost ,
        getPublishedPosts , 
        getPostBySlug,
        updatePost,
        deletePost,
        getMyPosts
} = require("../controllers/PostController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/mine", protect, getMyPosts);

router.get("/:slug", getPostBySlug);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
module.exports = router;