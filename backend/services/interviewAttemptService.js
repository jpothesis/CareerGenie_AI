// services/interviewAttemptService.js

const InterviewAttempt = require("../models/InterviewAttempt"); // Import the model

/**
 * Saves the final score of a completed interview session to the InterviewAttempt model.
 * This is the model used by the dashboard to calculate the average.
 * @param {string} userId - The ID of the user.
 * @param {number} score - The final score out of 5 (or whatever scale you use).
 * @param {string} role - The role the interview was for.
 * @param {string} sessionId - Reference to the original interview session.
 */
const saveInterviewAttemptScore = async (userId, score, role, sessionId) => {
    try {
        const attempt = await InterviewAttempt.create({
            user: userId,
            score: parseFloat(score), // Ensure it's stored as a number
            role: role,
            sessionRef: sessionId,
            // Add other necessary fields here, like totalDuration, etc.
        });
        
        console.log(`Interview attempt saved for session ${sessionId} with score: ${score}`);
        return attempt;

    } catch (error) {
        console.error("Failed to save interview attempt score:", error.message);
        // You might want to throw the error or handle logging here
        throw new Error("Database error while saving interview attempt.");
    }
};

module.exports = {
    saveInterviewAttemptScore,
};