// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();

// Assuming this middleware verifies the user is logged in
const { protect } = require('../middleware/authMiddleware'); 

// Import all necessary controller functions from the dashboard controller
const dashboardController = require('../controllers/dashboardController');

// Summary metrics (jobs, resume score, AI interview, learning)
// This is the endpoint that will power your StatCards component
router.get(
    '/summary', 
    protect, 
    dashboardController.getDashboardSummary
);

// Line graph: Monthly activity
router.get(
    '/activity', 
    protect, 
    dashboardController.getActivityGraph
);

// Radar chart: Usage Desktop vs Mobile
router.get(
    '/usage', 
    protect, 
    dashboardController.getUsageGraph
);

// Career Genie activities table
router.get(
    '/activities', 
    protect, 
    dashboardController.getCareerGenieActivities
);

module.exports = router;