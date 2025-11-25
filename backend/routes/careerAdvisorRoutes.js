const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { generateCareerAdvice } = require("../controllers/careerAdvisor.controller");

// Route to handle career advice requests
router.post("/advice", protect,generateCareerAdvice);

module.exports = router;
