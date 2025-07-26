const ActivityLog = require('../models/ActivityLog');

exports.getAssistantData = async (req, res) => {
  try {
    // Log assistant usage
    await ActivityLog.create({
      user: req.user.id,
      type: 'assistant',
      platform: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
      description: 'AI assistant used'
    });

    // Respond with assistant logic
    res.status(200).json({
      message: "Assistant endpoint hit",
      userId: req.user.id,
      response: [],
    });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to log assistant usage', error: error.message });
  }
};