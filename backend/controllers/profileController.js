// profileController.js

const Profile = require('../models/Profile'); // Make sure your Profile model is imported
const User = require('../models/User');     // Often needed to populate or check users

// ======================================================
// 1. Get logged-in user's profile
// Used in: router.get("/me", protect, getMyProfile);
// ======================================================
exports.getMyProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id })
            .populate('user', ['name', 'email']); // Populate user details
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }
        
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error while fetching profile." });
    }
};


// ======================================================
// 2. Create or update profile (UPSERT)
// Used in: router.post("/", protect, upsertProfile);
// (Your original code, kept intact as it was correct)
// ======================================================
exports.upsertProfile = async (req, res) => {
    try {
        // CRUCIAL CHECK: Ensure user ID is available from the 'protect' middleware.
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const data = { ...req.body };

        // 1. SKILLS: Convert comma-separated string to filtered array
        if (typeof data.skills === "string") {
            data.skills = data.skills
                .split(",")
                .map(s => s.trim())
                .filter(s => s.length > 0);
        }

        // 2. EXPERIENCE: Convert string dates to Date objects
        if (Array.isArray(data.experience) && data.experience.length > 0) {
            data.experience = data.experience.map(item => ({
                ...item,
                startDate: item.startDate ? new Date(item.startDate) : null,
                endDate: item.endDate ? new Date(item.endDate) : null,
            }));
        } else if (data.experience !== undefined) {
            // If client sent an empty array, delete it so Mongoose handles defaults
            delete data.experience;
        }

        // 3. EDUCATION: Convert string dates to Date objects
        if (Array.isArray(data.education) && data.education.length > 0) {
            data.education = data.education.map(item => ({
                ...item,
                startDate: item.startDate ? new Date(item.startDate) : null,
                endDate: item.endDate ? new Date(item.endDate) : null,
            }));
        } else if (data.education !== undefined) {
            delete data.education;
        }

        // Find existing profile
        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            // Create new profile
            profile = new Profile({
                user: req.user._id,
                ...data,
            });
        } else {
            // Update existing profile using .set() for proper Mongoose schema handling
            profile.set(data);
        }

        await profile.save();
        res.status(200).json(profile);

    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ message: "Unable to save profile", details: error.message });
    }
};


// ======================================================
// 3. Get profile by user ID (Public)
// Used in: router.get("/user/:userId", getProfileByUserId);
// ======================================================
exports.getProfileByUserId = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId })
            .populate('user', ['name', 'email']); // Populate user details

        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        res.status(200).json(profile);
    } catch (error) {
        // Log the error but send a standard 500 for non-existent/invalid IDs
        // Mongoose will throw a CastError if req.params.userId is not a valid ObjectId
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: "Invalid User ID format." });
        }
        console.error("Error fetching profile by user ID:", error);
        res.status(500).json({ message: "Server error while fetching profile." });
    }
};