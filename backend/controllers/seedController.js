const AppliedJob = require('../models/Job');
const ActivityLog = require('../models/ActivityLog');
const ResumeScore = require('../models/ResumeScore');
const InterviewAttempt = require('../models/InterviewAttempt');

exports.seedDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(`🌱 Seeding data for user: ${userId}...`);

    // 1. Clear old data (Optional: Remove this if you want to keep adding more)
    // await AppliedJob.deleteMany({ user: userId });
    // await ActivityLog.deleteMany({ user: userId });
    // await ResumeScore.deleteMany({ user: userId });

    // 2. Create Fake Jobs
    await AppliedJob.create([
        { user: userId, title: "Frontend Developer", company: "Google", status: "Applied", appliedAt: new Date() },
        { user: userId, title: "Software Engineer", company: "Netflix", status: "Interview", appliedAt: new Date() },
        { user: userId, title: "React Developer", company: "Meta", status: "Rejected", appliedAt: new Date() },
        { user: userId, title: "Full Stack Engineer", company: "Amazon", status: "Offer", appliedAt: new Date() },
        { user: userId, title: "Backend Developer", company: "Spotify", status: "Applied", appliedAt: new Date() }
      ]);
    // 3. Create Activity Logs (For Graph & Radar)
    const logs = [];
    const months = [0, 1, 2, 3, 4, 5]; // Last 6 months
    
    for (const m of months) {
      // Create random number of logs for each month
      const count = Math.floor(Math.random() * 5) + 3; 

      for (let i = 0; i < count; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - m); // Go back 'm' months

        logs.push({
          user: userId,
          type: i % 2 === 0 ? 'job_apply' : 'ai_interview',
          message: i % 2 === 0 ? 'Applied to a new job' : 'Practiced AI Interview',
          platform: Math.random() > 0.5 ? 'mobile' : 'desktop', // Randomize device
          timestamp: d
        });
      }
    }
    await ActivityLog.insertMany(logs);

    // 4. Create Scores
    await ResumeScore.create({ user: userId, score: 88, generatedAt: new Date() });
    await InterviewAttempt.create({ user: userId, score: 4.2, jobTitle: "Frontend Dev", date: new Date() });

    res.status(200).json({ message: "✅ Database populated with fake data!" });

  } catch (error) {
    console.error("Seeding Error:", error);
    res.status(500).json({ error: error.message });
  }
};