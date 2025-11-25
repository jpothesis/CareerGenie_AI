// routes/resumeRoutes.js

const express = require("express");
const router = express.Router();

const {
    generateResumeHandler,
    saveResume
} = require("../controllers/resumeController");

//const { protect } = require("../middleware/authMiddleware");

// Generate Resume (AI + PDF option)
router.post("/generate", generateResumeHandler);

// Save Resume Manually
router.post("/save", saveResume);

module.exports = router;