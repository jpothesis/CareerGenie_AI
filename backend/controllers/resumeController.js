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
    if (Array.isArray(oldArray)) {
        oldArray.forEach(item => {
            const key = item.role || item.title || item.id;
            if (key) oldMap.set(key, item.id);
        });
    }

    if (!Array.isArray(newArray)) return [];

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
        const targetJobTitle = structuredData.jobTitle || "Professional";

        if (!structuredData.name?.trim()) {
            return res
                .status(400)
                .json({ msg: "Please enter your Full Name to begin AI generation." });
        }

        // ----------------------------------------------------
        // 1. IMPROVED PROMPT: "CREATIVE MODE"
        // ----------------------------------------------------
        const prompt = `
You are an expert Resume Writer and Career Coach.
The user is applying for the role of: "${targetJobTitle}".

Here is the user's current raw data (which may be incomplete):
${JSON.stringify(structuredData)}

**YOUR TASK:**
Generate a complete, high-impact professional resume in JSON format.

**CRITICAL RULES FOR MISSING DATA:**
1. **DO NOT leave fields empty.**
2. If the user has no Experience, Skills, or Education listed, **YOU MUST HALLUCINATE/INVENT** realistic, high-quality, and impressive entries that would help someone get hired as a "${targetJobTitle}".
3. **Summary:** Write a compelling professional summary for a ${targetJobTitle}.
4. **Skills:** List 8-12 relevant hard and soft skills for a ${targetJobTitle}.
5. **Experience:** If missing, generate 2-3 realistic previous roles (e.g., "Junior ${targetJobTitle}", "Intern") with strong bullet points using action verbs.
6. **Projects:** If missing, generate 2 impressive projects relevant to ${targetJobTitle}.

**OUTPUT:**
Return ONLY valid JSON matching the schema.
`;

        // ----------------------------------------------------
        // 2. CALL AI SERVICE
        // ----------------------------------------------------
        const responseText = await generateFullText(prompt);

        // ----------------------------------------------------
        // 3. ROBUST JSON PARSING
        // ----------------------------------------------------
        let cleaned = responseText.trim();
        // Remove markdown code blocks if present (e.g. ```json ... ```)
        cleaned = cleaned.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "");

        try {
            generatedResumeData = JSON.parse(cleaned);
        } catch (err) {
            console.error("JSON parsing failed. Raw text:", responseText);
            // Fallback: Try to find the first '{' and last '}'
            const start = responseText.indexOf("{");
            const end = responseText.lastIndexOf("}");
            if (start !== -1 && end !== -1) {
                try {
                    generatedResumeData = JSON.parse(responseText.substring(start, end + 1));
                } catch (e2) {
                    return res.status(500).json({
                        msg: "AI generated invalid data structure. Please try again.",
                        error: "JSON Parse Error"
                    });
                }
            } else {
                return res.status(500).json({
                    msg: "AI failed to generate a valid resume. Please try again.",
                    error: "No JSON found"
                });
            }
        }

        // ----------------------------------------------------
        // 4. MERGE & FORMAT DATA
        // ----------------------------------------------------
        // We prioritize the AI's generated content, but we try to preserve IDs if they match old data
        generatedResumeData.experience = mergeIds(structuredData.experience, generatedResumeData.experience);
        generatedResumeData.education = mergeIds(structuredData.education, generatedResumeData.education);
        generatedResumeData.projects = mergeIds(structuredData.projects, generatedResumeData.projects);
        generatedResumeData.certifications = mergeIds(structuredData.certifications, generatedResumeData.certifications);

        // Ensure user's personal details aren't overwritten by "hallucinations" if they were provided
        if (structuredData.name) generatedResumeData.name = structuredData.name;
        if (structuredData.email) generatedResumeData.email = structuredData.email;
        if (structuredData.phone) generatedResumeData.phone = structuredData.phone;
        // Allow AI to refine the location/jobTitle if it thinks it's better, or keep user's:
        generatedResumeData.jobTitle = structuredData.jobTitle || generatedResumeData.jobTitle;

        // ----------------------------------------------------
        // 5. SAVE, SCORE & RETURN
        // ----------------------------------------------------
        let savedResume = null;
        if (userId) {
            // Calculate score on the NEW generated data
            await calculateAndSaveResumeScore(userId, generatedResumeData);
            await logActivity(userId, "resume_generation", `Generated Resume for ${targetJobTitle}`, req);

            if (structuredData.save) {
                savedResume = await Resume.create({
                    user: userId,
                    sections: generatedResumeData
                });
            }
        }

        if (structuredData.download) {
            const pdfBuffer = await generateResumePDF(generatedResumeData);
            const base64 = pdfBuffer.toString("base64");
            const fileName = `${(generatedResumeData.jobTitle || "Resume").replace(/[^a-z0-9]/gi, "_")}.pdf`;

            return res.status(200).json({
                fileName,
                contentType: "application/pdf",
                base64,
                resume: generatedResumeData,
                saved: !!savedResume,
                resumeId: savedResume?._id || null,
            });
        }

        return res.status(200).json({
            resume: generatedResumeData,
            saved: !!savedResume,
            resumeId: savedResume?._id || null,
        });

    } catch (error) {
        console.error("AI Generation Fatal Error:", error);
        return res.status(500).json({
            msg: "AI Generation service failed.",
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