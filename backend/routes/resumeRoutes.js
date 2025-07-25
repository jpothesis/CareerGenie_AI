const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getResumeData } = require("../controllers/resumeController");

router.get("/", protect, getResumeData);

module.exports = router;
