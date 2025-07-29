const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAssistantData, askAI } = require("../controllers/assistantController");

//GET route to fetch previous assistant data
router.get("/", protect, getAssistantData);

// Main POST route to handle AI queries
router.post("/ask", protect, askAI);

module.exports = router;
