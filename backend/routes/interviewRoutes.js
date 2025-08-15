const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getSummary
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware"); 

// Start a new interview
router.post("/start", protect, startInterview);

// Submit an answer and stream feedback
router.post("/answer/:sessionId", protect, submitAnswer);

// Get the final summary
router.get("/summary/:sessionId", protect, getSummary);

module.exports = router;
