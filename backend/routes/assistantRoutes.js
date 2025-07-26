const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAssistantData } = require("../controllers/assistantController");

router.get("/", protect, getAssistantData);

module.exports = router;
