// controllers/resumeController.js

const logActivity = require("../utils/activityLogger");
const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfService");
const { calculateAndSaveResumeScore } = require("../services/resumeScoreService");
const { generateFullText } = require("../services/geminiService");
const crypto = require("crypto");

// --- ID MERGING HELPER ---
const mergeIds = (oldArray, newArray) => {
    const oldMap = new Map();
    oldArray.forEach(item => {
        const key = item.role || item.title || item.id;
        if (key) oldMap.set(key, item.id);
    });

    return newArray.map(newItem => {
        const lookupKey = newItem.role || newItem.title;
        if (lookupKey && oldMap.has(lookupKey)) {
            return { ...newItem, id: oldMap.get(lookupKey) };
        }
        return { ...newItem, id: crypto.randomUUID() };
    });
};

// ------------------------------
// GENERATE RESUME (MAIN HANDLER)
// ------------------------------
const generateResumeHandler = async (req, res) => {
    let generatedResumeData = {};

    try {
        const structuredData = req.body;
        const userId = req.user?._id;

        if (!structuredData.name?.trim() || !structuredData.jobTitle?.trim()) {
            return res
                .status(400)
                .json({ msg: "Please enter your Full Name and desired Job Title to begin AI generation." });
        }

        // CLEAN JSON PROMPT
        const prompt = `
You are an AI resume generator.
Return STRICTLY valid JSON. No comments, no explanations, no headings.
Only return a single JSON object.
If something is missing, return an empty string instead of text.
Here is the user input:
${JSON.stringify(structuredData)}
`;

        const responseText = await generateFullText(prompt);

        // ----------------------------------------------------
        // FIX: CLEAN JSON EXTRACTION (Prevents 500 errors)
        // ----------------------------------------------------
        let cleaned = responseText.trim();

        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");

        if (start === -1 || end === -1) {
            console.error("Gemini returned NO JSON:", responseText);
            return res.status(500).json({
                msg: "AI returned no JSON. Try again.",
                error: "Invalid JSON format",
            });
        }

        cleaned = cleaned.substring(start, end + 1);

        try {
            generatedResumeData = JSON.parse(cleaned);
        } catch (err) {
            console.error("JSON parsing failed AFTER extraction:", cleaned);
            return res.status(500).json({
                msg: "AI response had invalid JSON structure.",
                error: err.message,
            });
        }

        // ----------------------------------------------------
        // MERGE USERS' EXISTING IDs
        // ----------------------------------------------------
        generatedResumeData.experience = mergeIds(structuredData.experience || [], generatedResumeData.experience || []);
        generatedResumeData.education = mergeIds(structuredData.education || [], generatedResumeData.education || []);
        generatedResumeData.projects = mergeIds(structuredData.projects || [], generatedResumeData.projects || []);
        generatedResumeData.certifications = mergeIds(structuredData.certifications || [], generatedResumeData.certifications || []);

        // Ensure simple arrays
        generatedResumeData.skills = Array.isArray(generatedResumeData.skills) ? generatedResumeData.skills : [];
        generatedResumeData.languages = Array.isArray(generatedResumeData.languages) ? generatedResumeData.languages : [];

        // LOGGING + SCORING + SAVING
        let savedResume = null;
        if (userId) {
            await logActivity(userId, "resume_generation", "Generated AI Resume", req);
            await calculateAndSaveResumeScore(userId, generatedResumeData);

            if (structuredData.save) {
                savedResume = await Resume.create({
                    user: userId,
                    sections: generatedResumeData
                });
            }
        }

        // PDF DOWNLOAD LOGIC
        if (structuredData.download) {
            const pdfBuffer = await generateResumePDF(generatedResumeData);
            const base64 = pdfBuffer.toString("base64");

            const fileName = `${
                generatedResumeData.jobTitle
                    ? generatedResumeData.jobTitle.replace(/[^a-z0-9]/gi, "_")
                    : "AI"
            }_Resume.pdf`;

            return res.status(200).json({
                fileName,
                contentType: "application/pdf",
                base64,
                resume: generatedResumeData,
                saved: !!savedResume,
                resumeId: savedResume?._id || null,
            });
        }

        // FINAL RESPONSE (ALWAYS RETURN resume)
        return res.status(200).json({
            resume: generatedResumeData,
            saved: !!savedResume,
            resumeId: savedResume?._id || null,
        });

    } catch (error) {
        console.error("AI Generation Fatal Error:", error.message);
        return res.status(500).json({
            msg: "AI Generation service failed. Please check your API Key and network.",
            error: error.message,
        });
    }
};

// SAVE RESUME (UNCHANGED)
const saveResume = async (req, res) => {
    try {
        const structuredData = req.body;
        const userId = req.user?._id;

        if (!structuredData || !userId) {
            return res.status(400).json({ msg: "Missing data or user not authenticated." });
        }

        const saved = await Resume.create({
            user: userId,
            sections: structuredData
        });

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
