const express = require("express");
const router = express.Router();
const {
  generateResumeHandler,
  saveResume,
  getResumeHistory,
  downloadResumePDF,
} = require("../controllers/resumeController");

const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateResumeHandler);
router.post("/save", protect, saveResume);
router.get("/history", protect, getResumeHistory);
router.post("/download", protect, downloadResumePDF);

module.exports = router;
