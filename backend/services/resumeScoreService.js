// services/resumeScoreService.js

const ResumeScore = require("../models/ResumeScore"); // Import the model

/**
 * Calculates a score based on resume data completeness and saves it to the database.
 * @param {string} userId - The ID of the user.
 * @param {object} resumeData - The data used to build/save the resume (name, skills, experience, etc.)
 */
const calculateAndSaveResumeScore = async (userId, resumeData) => {
    // Define weights for scoring (out of 100)
    const SCORE_WEIGHTS = {
        name: 5,
        jobTitle: 5,
        skills: 15,
        experience: 30, // Most important
        education: 15,
        projects: 10,
        summary: 10, // Check for a summary section
        textLength: 10, // Check for reasonable length
    };
    
    let score = 0;
    
    // --- 1. Scoring based on presence of key fields ---
    if (resumeData.name) score += SCORE_WEIGHTS.name;
    if (resumeData.jobTitle) score += SCORE_WEIGHTS.jobTitle;
    
    if (Array.isArray(resumeData.skills) && resumeData.skills.length > 3) {
        score += SCORE_WEIGHTS.skills;
    }

    if (Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
        score += SCORE_WEIGHTS.experience;
    }
    
    if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
        score += SCORE_WEIGHTS.education;
    }
    
    if (Array.isArray(resumeData.projects) && resumeData.projects.length > 0) {
        score += SCORE_WEIGHTS.projects;
    }
    
    // --- 2. Scoring based on generated/manual text content ---
    const rawText = resumeData.rawText || (typeof resumeData.sections === 'object' ? resumeData.sections.raw : '');
    
    if (rawText && rawText.length > 500) { // Check if the generated resume is long enough
        score += SCORE_WEIGHTS.textLength;
    }
    
    // Simple check for "summary" in the text
    if (rawText && /summary|profile/i.test(rawText)) {
        score += SCORE_WEIGHTS.summary;
    }

    // Ensure score is capped at 100
    const finalScore = Math.min(Math.round(score), 100);

    // --- 3. Save the score to the ResumeScore model ---
    await ResumeScore.findOneAndUpdate(
        { user: userId },
        { user: userId, score: finalScore },
        { upsert: true, new: true, setDefaultsOnInsert: true } // Creates new document if none exists
    );
    
    console.log(`Resume Score for user ${userId} updated to: ${finalScore}`);
    
    return finalScore;
};

module.exports = {
    calculateAndSaveResumeScore,
};