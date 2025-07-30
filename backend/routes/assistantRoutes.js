// routes/assistantRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAssistantData } = require("../controllers/assistantController");

// Only one route to handle assistant queries
router.post("/ask", protect, getAssistantData);

// Optional: placeholder if you want a GET version later
// router.get("/", protect, getSomeHistoryFunction);

module.exports = router;
