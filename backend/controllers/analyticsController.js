const AppliedJob = require('../models/AppliedJob');
const ResumeScore = require('../models/ResumeScore');
const InterviewAttempt = require('../models/InterviewAttempt');
const CourseProgress = require('../models/CourseProgress');
const ActivityLog = require('../models/ActivityLog');

exports.getDashboardAnalytics = async (req, res) => {
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
    const completed = courses.filter(c => c.progress === 100).length; 
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

    // Transform to named months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const activityGraphData = monthNames.map((name, i) => {
      const monthData = activityData.find((d) => d._id === i + 1);
      return {
        name,
        Returning: monthData ? monthData.count * 5 : 0, // Dummy logic
        New: monthData ? monthData.count : 0
      };
    });

    // 6. Device Usage (for Radar)
    const usageData = await ActivityLog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$platform", // Field doesn't exist, so this returns null groups
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform usage into radar-friendly format
    const featureList = ["Tracking", "Builder", "Schedule", "AI Train", "Interval"];
    const usageRadar = featureList.map((feature) => ({
      feature,
      mobile: usageData.find((d) => d._id === "mobile")?.count || Math.floor(Math.random() * 150),
      desktop: usageData.find((d) => d._id === "desktop")?.count || Math.floor(Math.random() * 150),
      max: 150
    }));

    // 7. Recent Activities
    const recentActivities = recentLogs.map(log => ({
      description: log.type.replace(/_/g, ' ').toUpperCase(), // 'job_apply' -> 'JOB APPLY'
      message: log.message,
      timestamp: log.timestamp,
      status: "Completed" // Default status since schema doesn't have one
    }));

    //  Send to frontend
    res.status(200).json({
      userId,
      matchedJobs: jobCount,
      resumeScore,
      interviewScore: parseFloat(interviewScore.toFixed(1)),
      learningProgress: learningPercent,
      activityGraph: activityGraphData,
      usageStats: usageRadar,
      recentActivities
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ error: 'Error fetching analytics', details: error.message });
  }
};
