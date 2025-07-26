const AppliedJob = require('../models/AppliedJob');
const ResumeScore = require('../models/ResumeScore');
const InterviewAttempt = require('../models/InterviewAttempt');
const CourseProgress = require('../models/CourseProgress');
const ActivityLog = require('../models/ActivityLog');

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Matched Jobs
    const jobCount = await AppliedJob.countDocuments({ user: userId });

    // 2. Resume Score
    const resume = await ResumeScore.findOne({ user: userId }).sort({ updatedAt: -1 });
    const resumeScore = resume ? resume.score : 0;

    // 3. AI Interview Avg Score
    const attempts = await InterviewAttempt.find({ user: userId }).sort({ date: -1 }).limit(5);
    const interviewScore = attempts.length
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
      : 0;

    // 4. Learning Progress %
    const courses = await CourseProgress.find({ user: userId });
    const completed = courses.filter(c => c.completed).length;
    const total = courses.length;
    const learningPercent = total ? Math.round((completed / total) * 100) : 0;

    // 5. Activity over months
    const activityData = await ActivityLog.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { $month: "$timestamp" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 6. Device Usage
    const usageData = await ActivityLog.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 }
        }
      }
    ]);

    // 7. Recent Activities
    const recentActivities = await ActivityLog.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(6);

    res.status(200).json({
      userId,
      matchedJobs: jobCount,
      resumeScore,
      interviewScore: interviewScore.toFixed(1),
      learningProgress: learningPercent,
      activityGraph: activityData,
      usageStats: usageData,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching analytics', details: error.message });
  }
};
  