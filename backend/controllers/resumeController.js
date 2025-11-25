// controllers/resumeController.js

const logActivity = require("../utils/activityLogger");
const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfService");
const { calculateAndSaveResumeScore } = require("../services/resumeScoreService");
const { generateStructuredData, SchemaType } = require("../services/geminiService"); // Import generic service
const crypto = require("crypto");

// ------------------------------
// 1. DEFINE RESUME SCHEMA 
// ------------------------------
const resumeSchema = {
    type: SchemaType.OBJECT,
    properties: {
        name: { type: SchemaType.STRING },
        email: { type: SchemaType.STRING },
        phone: { type: SchemaType.STRING },
        location: { type: SchemaType.STRING },
        jobTitle: { type: SchemaType.STRING },
        summary: { type: SchemaType.STRING },

        skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        languages: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },

        experience: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    role: { type: SchemaType.STRING },
                    company: { type: SchemaType.STRING },
                    duration: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                },
                required: ["role", "company", "description"], 
            },
        },

        education: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    degree: { type: SchemaType.STRING },
                    institution: { type: SchemaType.STRING },
                    year: { type: SchemaType.STRING },
                    gpa: { type: SchemaType.STRING },
                },
                required: ["degree", "institution"],
            },
        },

        projects: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    techStack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    link: { type: SchemaType.STRING },
                },
                required: ["title", "description"],
            },
        },
        
        certifications: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    issuer: { type: SchemaType.STRING },
                    date: { type: SchemaType.STRING },
                },
                required: ["title"],
            },
        },
    },
    required: ["name", "jobTitle", "summary", "skills", "experience", "education"],
};


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
// GENERATE RESUME HANDLER
// ------------------------------
const generateResumeHandler = async (req, res) => {
    let generatedResumeData = {};

    try {
        const structuredData = req.body;
        const userId = req.user?._id;
        const targetJobTitle = structuredData.jobTitle || "Professional";

        if (!structuredData.name?.trim()) {
            return res.status(400).json({ msg: "Please enter your Full Name." });
        }

        // 2. CONSTRUCT PROMPT HERE
        const prompt = `
            You are an expert Resume Writer.
            User Role: "${targetJobTitle}".
            User Data: ${JSON.stringify(structuredData)}

            TASK: Generate a high-impact resume.
            RULES:
            1. If experience/skills/projects are missing, INVENT realistic, high-quality entries for a ${targetJobTitle}.
            2. Do not leave array fields empty.
            3. Use professional action verbs.
            4. Summary should be 3-4 lines long.
        `;

        // 3. CALL GENERIC SERVICE WITH SPECIFIC SCHEMA
        const responseText = await generateStructuredData(prompt, resumeSchema);

        // Parsing Logic
        let cleaned = responseText.trim();
        cleaned = cleaned.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "");

        try {
            generatedResumeData = JSON.parse(cleaned);
        } catch (err) {
            // Fallback for messy JSON
            const start = responseText.indexOf("{");
            const end = responseText.lastIndexOf("}");
            if (start !== -1 && end !== -1) {
                generatedResumeData = JSON.parse(responseText.substring(start, end + 1));
            } else {
                throw new Error("Invalid JSON structure returned by AI");
            }
        }

        // Merge logic
        generatedResumeData.experience = mergeIds(structuredData.experience, generatedResumeData.experience);
        generatedResumeData.education = mergeIds(structuredData.education, generatedResumeData.education);
        generatedResumeData.projects = mergeIds(structuredData.projects, generatedResumeData.projects);
        generatedResumeData.certifications = mergeIds(structuredData.certifications, generatedResumeData.certifications);

        // Preserve user overrides
        if (structuredData.name) generatedResumeData.name = structuredData.name;
        if (structuredData.email) generatedResumeData.email = structuredData.email;
        if (structuredData.phone) generatedResumeData.phone = structuredData.phone;
        generatedResumeData.jobTitle = structuredData.jobTitle || generatedResumeData.jobTitle;

        // Save & Log
        let savedResume = null;
        if (userId) {
            await logActivity(userId, "resume_generation", `Generated Resume for ${targetJobTitle}`, req);
            await calculateAndSaveResumeScore(userId, generatedResumeData);

            if (structuredData.save) {
                savedResume = await Resume.create({
                    user: userId,
                    sections: generatedResumeData
                });
            }
        }

        if (structuredData.download) {
            const pdfBuffer = await generateResumePDF(generatedResumeData);
            return res.status(200).json({
                fileName: "Resume.pdf",
                contentType: "application/pdf",
                base64: pdfBuffer.toString("base64"),
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
        console.error("AI Generation Error:", error);
        return res.status(500).json({
            msg: "AI Generation service failed.",
            error: error.message,
        });
    }
};

const saveResume = async (req, res) => {
    try {
        const structuredData = req.body;
        const userId = req.user?._id;
        if (!structuredData || !userId) return res.status(400).json({ msg: "Missing data." });

        const saved = await Resume.create({ user: userId, sections: structuredData });
        await calculateAndSaveResumeScore(userId, structuredData);
        res.status(201).json({ msg: "Resume saved.", resumeId: saved._id });
    } catch (err) {
        res.status(500).json({ msg: "Failed to save", error: err.message });
    }
};

module.exports = { generateResumeHandler, saveResume };