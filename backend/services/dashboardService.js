// services/dashboardService.js

// Import your models
const AppliedJob = require('../models/AppliedJob');
const ResumeScore = require('../models/ResumeScore');
const InterviewAttempt = require('../models/InterviewAttempt');
const CourseProgress = require('../models/CourseProgress');

// Set a configuration for total learning modules
const TOTAL_LEARNING_MODULES = 6; 
const INTERVIEW_ATTEMPTS_TO_AVERAGE = 5;

const getDashboardStats = async (userId) => {
    // 1. Opportunities Matched (Offers Received)
    const matchedJobs = await AppliedJob.countDocuments({ 
        user: userId, 
        offerReceived: true // Assuming 'offerReceived' is the field in AppliedJob model
    });

    // 2. Resume Score
    // Get the latest score
    const resumeData = await ResumeScore.findOne({ user: userId }).sort({ updatedAt: -1 }); 
    const resumeScore = resumeData ? resumeData.score : 0; 
    
    // 3. AI Interview Performance
    // Get the last N attempts
    const latestAttempts = await InterviewAttempt.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(INTERVIEW_ATTEMPTS_TO_AVERAGE);

    let interviewScore = 0;
    if (latestAttempts.length > 0) {
        const totalScore = latestAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
        interviewScore = (totalScore / latestAttempts.length).toFixed(1); // Avg score, 1 decimal place
    }

    // 4. Learning Progress
    // Count completed courses/modules
    const progress = await CourseProgress.findOne({ user: userId }); 
    const completedCourses = progress ? progress.completedCount : 0; // Assuming CourseProgress model has completedCount field
    
    const learningProgress = Math.min(
        Math.round((completedCourses / TOTAL_LEARNING_MODULES) * 100), 
        100 // Cap at 100%
    );
    
    // Return the aggregated object matching your frontend's 'data' structure
    return {
        matchedJobs,
        resumeScore,
        interviewScore: parseFloat(interviewScore),
        learningProgress,
        completedCourses,
        totalCourses: TOTAL_LEARNING_MODULES,
    };
};

module.exports = { 
    getDashboardStats, 
    // You'll also need functions to update the data when the user takes action:
    // updateResumeScore, updateInterviewAttempt, incrementCourseProgress
};