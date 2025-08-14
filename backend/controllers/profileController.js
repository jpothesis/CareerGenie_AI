const Profile = require("../models/Profile");

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate("user", ["email"]);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update profile
// @route   POST /api/profile
// @access  Private
const upsertProfile = async (req, res) => {
  try {
    const { fullName, headline, bio, location, skills, profilePic, experience, education } = req.body;

    const profileFields = {
      user: req.user._id,
      fullName,
      headline,
      bio,
      location,
      profilePic,
      skills: Array.isArray(skills) ? skills : skills?.split(",").map(s => s.trim()) || [],
      experience,
      education
    };

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:userId
// @access  Public
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate("user", ["email"]);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, upsertProfile, getProfileByUserId };
