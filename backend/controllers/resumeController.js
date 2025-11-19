// controllers/resumeController.js
const logActivity = require('../utils/activityLogger');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfService");

// ⭐️ NEW IMPORT: Assuming you create this service file
const { calculateAndSaveResumeScore } = require("../services/resumeScoreService");

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate resume using Gemini
const generateResumeHandler = async (req, res) => {
  try {
    const {
      name,
      jobTitle,
      skills = [],
      experience = [],
      education = [],
      projects = [],
      jobDescription = "",
      save,
      download,
    } = req.body;
    const userId = req.user?._id; // Ensure you grab the user ID

    if (!name || !jobTitle) {
      return res.status(400).json({ msg: "Name and job title are required." });
    }

    // Prompt for Gemini (The prompt logic remains correct)
    const prompt = `
    You are a professional resume builder. Based on the following candidate information, generate a clean, ATS-friendly professional resume in plain text only.

    The resume should include:
    1. A brief professional summary (2–4 lines).
    2. Structured sections: Skills, Experience, Education, Projects.
    3. No markdown, HTML, or extra formatting.

    Name: ${name}
    Job Title: ${jobTitle}
    Skills: ${skills.join(", ")}
    Experience: ${experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join("; ")}
    Education: ${education.map(e => `${e.degree}, ${e.institution} (${e.year})`).join("; ")}
    Projects: ${projects.map(p => `${p.title}: ${p.description}`).join("; ")}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const resumeText = result.response.text();

    // LOG ACTIVITY: Log resume generation activity
    if (userId) {
      await logActivity(userId, 'resume_generation', 'Generated AI Resume', req);
  }

    // 1. Save to DB if requested
    let savedResume = null;
    if (save && userId) {
      savedResume = await Resume.create({
        user: userId,
        sections: { raw: resumeText },
      });
    }

    // ⭐️ 2. CALCULATE AND SAVE RESUME SCORE (Trigger)
    if (userId) {
      // Pass the raw text and structured data for comprehensive scoring
      await calculateAndSaveResumeScore(userId, { 
          name, 
          jobTitle, 
          skills, 
          experience, 
          education, 
          projects,
          rawText: resumeText
      });
    }
    
    // 3. Download and Response Logic (Remains correct)
    if (download) {
      const pdfBuffer = await generateResumePDF({
        name,
        jobTitle,
        sections: { raw: resumeText },
      });

      const base64 = pdfBuffer.toString("base64");
      const fileName = `${jobTitle.replace(/[^a-z0-9]/gi, "_")}_Resume.pdf`;

      return res.status(200).json({
        fileName,
        contentType: "application/pdf",
        base64,
        resume: resumeText,
        saved: !!savedResume,
        resumeId: savedResume?._id || null,
      });
    }

    // Return generated resume only
    res.status(200).json({
      resume: resumeText,
      saved: !!savedResume,
      resumeId: savedResume?._id || null,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ msg: "Failed to generate resume", error: error.message });
  }
};

// Save resume manually
const saveResume = async (req, res) => {
  try {
    const { sections, structuredData } = req.body; // structuredData might be needed for better scoring
    const userId = req.user?._id;
    
    if (!sections || !userId) {
      return res.status(400).json({ msg: "Missing data or user not authenticated." });
    }

    const saved = await Resume.create({
      user: userId,
      sections, // This is the user's manual or refined version
    });

    // ⭐️ CALCULATE AND SAVE RESUME SCORE (Trigger for manual save)
    // You might need more data than just 'sections' for a detailed score
    const dataForScoring = structuredData || { rawText: sections.raw || JSON.stringify(sections) };
    await calculateAndSaveResumeScore(userId, dataForScoring);

    res.status(201).json({ msg: "Resume saved.", resumeId: saved._id });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save resume", error: err.message });
  }
};

// Fetch resume history (Remains correct)
const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch history", error: err.message });
  }
};

// Download PDF from saved resume (Remains correct)
const downloadResumePDF = async (req, res) => {
  try {
    const { name, jobTitle, sections } = req.body;
    if (!name || !jobTitle || !sections) {
      return res.status(400).json({ msg: "Incomplete resume data." });
    }

    const pdfBuffer = await generateResumePDF({ name, jobTitle, sections });
    const base64 = pdfBuffer.toString("base64");
    const fileName = `${jobTitle.replace(/[^a-z0-9]/gi, "_")}_Resume.pdf`;

    res.status(200).json({
      fileName,
      contentType: "application/pdf",
      base64,
    });
  } catch (err) {
    res.status(500).json({ msg: "PDF generation failed", error: err.message });
  }
};

module.exports = {
  generateResumeHandler,
  saveResume,
  getResumeHistory,
  downloadResumePDF,
};