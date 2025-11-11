// controllers/dashboardController.js
const dashboardService = require('../services/dashboardService');

const getStats = async (req, res) => {
    // req.user.id comes from your auth middleware after successful authentication
    const userId = req.user.id; 

    try {
        const stats = await dashboardService.getDashboardStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to load dashboard statistics." });
    }
};

module.exports = {
    getStats
};