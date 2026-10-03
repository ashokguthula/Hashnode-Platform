const express = require("express");

const {
    getUserProfile,
    updateMyProfile,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Logged-in user's own profile
router.put("/me", protect, updateMyProfile);

// Public profile
router.get("/:id", getUserProfile);

module.exports = router;