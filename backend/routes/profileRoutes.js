// routes/profileRoutes.js

const express = require("express");
const {
  // 🔑 Double-check that all three of these functions are correctly exported 
  // and the path to profileController is correct.
  getMyProfile,
  upsertProfile,
  getProfileByUserId
} = require("../controllers/profileController"); 

const { 
  // 🔑 Double-check that 'protect' is correctly exported 
  // and the path to authMiddleware is correct.
  protect 
} = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get logged-in user's profile
// @access  Private
// Line 14 is likely here: If getMyProfile or protect is undefined, the server crashes.
router.get("/me", protect, getMyProfile);

// @route   POST /api/profile
// @desc    Create or update logged-in user's profile
// @access  Private
router.post("/", protect, upsertProfile);

// @route   GET /api/profile/user/:userId
// @desc    Get profile by user ID (public)
// @access  Public
router.get("/user/:userId", getProfileByUserId);

module.exports = router;