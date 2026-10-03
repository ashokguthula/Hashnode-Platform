const express = require("express");

const {
    getAllTags,
    getPostsByTag,
} = require("../controllers/TagController");

const router = express.Router();

router.get("/", getAllTags);
router.get("/:slug/posts", getPostsByTag);

module.exports = router;