const express = require("express");
const router = express.Router();
const { generateCareerAdvice } = require("../controllers/careerAdvisor.controller");

// Route to handle career advice requests
router.post("/advice", generateCareerAdvice);

module.exports = router;
