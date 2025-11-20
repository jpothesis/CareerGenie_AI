// controllers/resumeController.js

const logActivity = require("../utils/activityLogger");
const Resume = require("../models/Resume");
// Assuming you have these services implemented:
const { generateResumePDF } = require("../services/pdfService");
const { calculateAndSaveResumeScore } = require("../services/resumeScoreService");
const { generateFullText } = require("../services/geminiService");
const crypto = require('crypto'); 

// --- ID MERGING HELPER (Unchanged) ---
const mergeIds = (oldArray, newArray) => {
    const oldMap = new Map();
    oldArray.forEach(item => {
        const key = item.role || item.title || item.id;
        if (key) {
            oldMap.set(key, item.id);
        }
    });
    
    return newArray.map(newItem => {
        const lookupKey = newItem.role || newItem.title;
        
        if (lookupKey && oldMap.has(lookupKey)) {
            return { ...newItem, id: oldMap.get(lookupKey) }; 
        }

        // New item gets a fresh UUID
        return { ...newItem, id: crypto.randomUUID() }; 
    });
};

// ------------------------------
// GENERATE RESUME (MAIN HANDLER)
// ------------------------------
const generateResumeHandler = async (req, res) => {
    let generatedResumeData = {}; // Initialize to empty object for safety
    
    try {
        const structuredData = req.body;
        const userId = req.user?._id;

        if (!structuredData.name || structuredData.name.trim() === "" || !structuredData.jobTitle || structuredData.jobTitle.trim() === "") {
            return res.status(400).json({ msg: "Please enter your Full Name and desired Job Title to begin AI generation." });
        }

        // PROMPT: Critical instruction to preserve existing IDs
        const prompt = `
            You are a professional resume builder. Analyze the following partial resume data and return a complete, professional, ATS-optimized resume as a JSON object.

            - Improve summary, make experience achievement-based, and generate missing project/education content.
            - **CRITICAL**: Do not change the 'id' field for any existing entry.

            Current Resume Data:
            ${JSON.stringify(structuredData, null, 2)}
        `;

        const responseText = await generateFullText(prompt);

        try {
            // Attempt to parse the AI output
            generatedResumeData = JSON.parse(responseText);
        } catch (err) {
            console.error("Parsing Gemini JSON failed:", responseText);
            return res.status(500).json({
                msg: "AI response was not valid JSON. Please try again.",
                error: "Invalid JSON format from AI model.",
            });
        }

        // 🔥 CRITICAL FIX: Merge/Assign stable IDs and ensure data integrity
        generatedResumeData.experience = mergeIds(structuredData.experience, generatedResumeData.experience || []);
        generatedResumeData.education = mergeIds(structuredData.education, generatedResumeData.education || []);
        generatedResumeData.projects = mergeIds(structuredData.projects, generatedResumeData.projects || []);
        generatedResumeData.certifications = mergeIds(structuredData.certifications, generatedResumeData.certifications || []);
        
        // Safety check for simple arrays
        generatedResumeData.skills = Array.isArray(generatedResumeData.skills) ? generatedResumeData.skills : [];
        generatedResumeData.languages = Array.isArray(generatedResumeData.languages) ? generatedResumeData.languages : [];


        // LOG, SAVE, SCORE (Assuming these services are correct)
        let savedResume = null;
        if (userId) {
            await logActivity(userId, "resume_generation", "Generated AI Resume", req);
            await calculateAndSaveResumeScore(userId, generatedResumeData);

            if (structuredData.save) {
                savedResume = await Resume.create({ user: userId, sections: generatedResumeData });
            }
        }
        
        // DOWNLOAD LOGIC (if requested)
        if (structuredData.download) {
            const pdfBuffer = await generateResumePDF(generatedResumeData);
            const base64 = pdfBuffer.toString("base64");
            const fileName = `${generatedResumeData.jobTitle ? generatedResumeData.jobTitle.replace(/[^a-z0-9]/gi, "_") : 'AI'}_Resume.pdf`;

            return res.status(200).json({
                fileName,
                contentType: "application/pdf",
                base64,
                resume: generatedResumeData, // Still send structured data for frontend update
                saved: !!savedResume,
                resumeId: savedResume?._id || null,
            });
        }

        // 🔥 FINAL FIX: Guarantee the 'resume' property exists in the 200 response
        return res.status(200).json({
            resume: generatedResumeData, // This must be a valid object for the frontend to work
            saved: !!savedResume,
            resumeId: savedResume?._id || null,
        });

    } catch (error) {
        // This catch block handles errors thrown by generateFullText (API Key, network issues, timeouts)
        console.error("AI Generation Fatal Error:", error.message);
        return res.status(500).json({
            msg: "AI Generation service failed. Please check your API Key and network.",
            error: error.message,
        });
    }
};

const saveResume = async (req, res) => {
    // ... (Save logic remains unchanged) ...
    try {
        const structuredData = req.body;
        const userId = req.user?._id;

        if (!structuredData || !userId) {
            return res.status(400).json({ msg: "Missing data or user not authenticated." });
        }

        const saved = await Resume.create({ user: userId, sections: structuredData });

        await calculateAndSaveResumeScore(userId, structuredData);

        res.status(201).json({ msg: "Resume saved.", resumeId: saved._id });
    } catch (err) {
        res.status(500).json({ msg: "Failed to save resume", error: err.message });
    }
};

module.exports = {
    generateResumeHandler,
    saveResume,
};