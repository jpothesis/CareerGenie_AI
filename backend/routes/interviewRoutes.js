// routes/interviewRoutes.js

const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getSummary,
  // ⭐️ CORRECTION: You must import the new controller function
  endInterview 
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

// Start a new interview
router.post("/start", protect, startInterview);

// Submit an answer and stream feedback
router.post("/answer/:sessionId", protect, submitAnswer);

// ⭐️ NEW ROUTE: Finalize the interview and save the overall score
router.post('/:sessionId/end', protect, endInterview);

// Get the final summary
router.get("/summary/:sessionId", protect, getSummary);

module.exports = router;