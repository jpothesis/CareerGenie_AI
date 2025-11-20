const ActivityLog = require('../models/ActivityLog');

/**
 * Logs a user activity to the database.
 * @param {string} userId - The ID of the user.
 * @param {string} type - One of the valid enums (job_apply, ai_interview, etc.)
 * @param {string} message - Human readable message (e.g. "Applied to Google")
 * @param {Object} req - The Express request object (to detect device)
 */
const logActivity = async (userId, type, message, req) => {
  try {
    // 1. Auto-detect if they are on Mobile or Desktop
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /mobile/i.test(userAgent);
    const platform = isMobile ? 'mobile' : 'desktop';

    // 2. Save to MongoDB
    await ActivityLog.create({
      user: userId,
      type,
      message,
      platform
    });

    console.log(` Logged: ${type} on ${platform}`);
  } catch (error) {
    console.error(" Failed to log activity:", error.message);
  }
};

module.exports = logActivity;