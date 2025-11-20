const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDashboardAnalytics } = require("../controllers/analyticsController");
const { seedDashboardData } = require("../controllers/seedController");

router.get("/", protect, getDashboardAnalytics);
router.post("/seed", protect, seedDashboardData);

module.exports = router;
