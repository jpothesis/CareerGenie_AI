const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getSummary,
  endInterview 
} = require("../controllers/interviewController");

// [CRITICAL FIX] Import the protect middleware
const { protect } = require("../middleware/authMiddleware");

// [CRITICAL FIX] Add 'protect' to ALL routes so req.user exists

// Start a new interview
router.post("/start", protect, startInterview);

// Submit an answer and stream feedback
router.post("/answer/:sessionId", protect, submitAnswer);

// Finalize the interview and save the overall score
router.post('/:sessionId/end', protect, endInterview);

// Get the final summary
router.get("/summary/:sessionId", protect, getSummary);

module.exports = router;