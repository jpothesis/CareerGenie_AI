const express = require("express");
const { getMyProfile, upsertProfile, getProfileByUserId } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);       // Get own profile
router.post("/", protect, upsertProfile);       // Create or update profile
router.get("/user/:userId", getProfileByUserId); // Public view of profile

module.exports = router;
