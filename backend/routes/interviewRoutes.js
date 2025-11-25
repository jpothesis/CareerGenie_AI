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

// Start a new interview
router.post("/start", startInterview);

// Submit an answer and stream feedback
router.post("/answer/:sessionId",  submitAnswer);

// ⭐️ NEW ROUTE: Finalize the interview and save the overall score
router.post('/:sessionId/end',  endInterview);

// Get the final summary
router.get("/summary/:sessionId", getSummary);

module.exports = router;