// controllers/resumeController.js

const logActivity = require("../utils/activityLogger");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfService");
const { calculateAndSaveResumeScore } = require("../services/resumeScoreService");
const { generateFullText } = require("../services/geminiService"); // Schema-enforced Gemini handler

// ------------------------------
// GENERATE RESUME (MAIN HANDLER)
// ------------------------------
const generateResumeHandler = async (req, res) => {
  try {
    const structuredData = req.body; // Full structured ResumeData from frontend
    const userId = req.user?._id;

    // VALIDATION: Name + Job Title required
    if (
      !structuredData.name ||
      structuredData.name.trim() === "" ||
      !structuredData.jobTitle ||
      structuredData.jobTitle.trim() === ""
    ) {
      return res.status(400).json({
        msg: "Please enter your Full Name and desired Job Title to begin AI generation.",
      });
    }

    // PROMPT (GeminiSchema already handles strict JSON generation)
    const prompt = `
      You are a professional resume builder. Analyze the following partial resume data and return a complete, professional, ATS-optimized resume as a JSON object.

      - Fill any missing contact details using placeholder values like "[email@example.com]".
      - Improve summary, make experience achievement-based, and generate missing project/education content.

      Current Resume Data:
      ${JSON.stringify(structuredData, null, 2)}
    `;

    // AI RESPONSE → always JSON from geminiService
    const responseText = await generateFullText(prompt);

    let generatedResumeData;
    try {
      generatedResumeData = JSON.parse(responseText);
    } catch (err) {
      console.error("Parsing Gemini JSON failed:", responseText);
      return res.status(500).json({
        msg: "AI response was not valid JSON.",
        raw: responseText,
      });
    }

    // LOG ACTIVITY
    if (userId) {
      await logActivity(userId, "resume_generation", "Generated AI Resume", req);
    }

    // SAVE IF REQUESTED
    let savedResume = null;
    if (structuredData.save && userId) {
      savedResume = await Resume.create({
        user: userId,
        sections: generatedResumeData,
      });
    }

    // SAVE SCORE
    if (userId) {
      await calculateAndSaveResumeScore(userId, generatedResumeData);
    }

    // DOWNLOAD → RETURN PDF
    if (structuredData.download) {
      const pdfBuffer = await generateResumePDF(generatedResumeData);
      const base64 = pdfBuffer.toString("base64");

      const fileName = `${generatedResumeData.jobTitle.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_Resume.pdf`;

      return res.status(200).json({
        fileName,
        contentType: "application/pdf",
        base64,
        resume: generatedResumeData,
        saved: !!savedResume,
        resumeId: savedResume?._id || null,
      });
    }

    // DEFAULT → RETURN STRUCTURED DATA
    return res.status(200).json({
      resume: generatedResumeData,
      saved: !!savedResume,
      resumeId: savedResume?._id || null,
    });
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    return res.status(500).json({
      msg: "Failed to generate resume",
      error: error.message,
    });
  }
};

// ------------------------------
// SAVE RESUME MANUALLY
// ------------------------------
const saveResume = async (req, res) => {
  try {
    const structuredData = req.body;
    const userId = req.user?._id;

    if (!structuredData || !userId) {
      return res.status(400).json({
        msg: "Missing data or user not authenticated.",
      });
    }

    const saved = await Resume.create({
      user: userId,
      sections: structuredData,
    });

    // SAVE SCORE
    await calculateAndSaveResumeScore(userId, structuredData);

    res.status(201).json({
      msg: "Resume saved.",
      resumeId: saved._id,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to save resume",
      error: err.message,
    });
  }
};

module.exports = {
  generateResumeHandler,
  saveResume,
};
