const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDashboardAnalytics } = require("../controllers/analyticsController");

router.get("/", protect, getDashboardAnalytics);

module.exports = router;
