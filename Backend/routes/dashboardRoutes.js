const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboardSummary,
  getActivityGraph,
  getUsageGraph,
  getCareerGenieActivities
} = require('../controllers/dashboardController');

// Summary metrics (jobs, resume score, AI interview, learning)
router.get('/summary', protect, getDashboardSummary);

// Line graph: Monthly activity
router.get('/activity', protect, getActivityGraph);

// Radar chart: Usage Desktop vs Mobile
router.get('/usage', protect, getUsageGraph);

// Career Genie activities table
router.get('/activities', protect, getCareerGenieActivities);

module.exports = router;
