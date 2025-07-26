const ResumeScore = require('../models/ResumeScore');

exports.getResumeData = async (req, res) => {
  try {
    const score = await ResumeScore.findOne({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({
      message: "Resume Builder data",
      userId: req.user.id,
      resumeScore: score || null,
      sections: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume data' });
  }
};