// controllers/resumeController.js

const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfService"); // Assumed to handle structured data
const { calculateAndSaveResumeScore } = require("../services/resumeScoreService"); // Assumed service
const { generateFullText } = require("../services/geminiService"); // ⭐️ CRITICAL: Imports schema-enforced AI service

// Generate resume using Gemini
const generateResumeHandler = async (req, res) => {
  try {
    // Expecting the entire structured ResumeData object from the frontend
    const structuredData = req.body; 
    const userId = req.user?._id; 
    
    // 🛑 CRITICAL FIX: Validate mandatory fields (checking for empty strings)
    if (!structuredData.name || structuredData.name.trim() === "" || 
        !structuredData.jobTitle || structuredData.jobTitle.trim() === "") {
      
      // Returns 400 Bad Request if mandatory data is missing
      return res.status(400).json({ 
        msg: "Please enter your **Full Name** and desired **Job Title** to begin AI generation." 
      });
    }

    // ⭐️ 1. SIMPLIFIED PROMPT: Rely on the schema configured in geminiService.js
    const prompt = `
    You are a professional resume builder. Your task is to analyze the following partial resume data and return a complete, professional, and ATS-friendly resume as a single JSON object. 
    
    Fill in missing contact information (email, phone, etc.) using appropriate placeholder values like "[email@example.com]". Generate high-quality content for the professional summary, and flesh out all missing or incomplete items in the experience, education, and projects sections.

    Current Partial Data: ${JSON.stringify(structuredData, null, 2)}
    `;

    // 2. AI GENERATION & ROBUST PARSING
    // The service ensures the output is a clean JSON string ready for parsing
    const responseText = await generateFullText(prompt);
    
    let generatedResumeData;
    try {
        generatedResumeData = JSON.parse(responseText);
    } catch (parseError) {
        console.error("Failed to parse Gemini JSON response (raw):", responseText);
        return res.status(500).json({ msg: "AI response was not valid JSON.", raw: responseText });
    }

    // 3. Save to DB if requested
    let savedResume = null;
    if (structuredData.save && userId) {
      savedResume = await Resume.create({
        user: userId,
        // Save the full structured data object, matching the Resume.js schema
        sections: generatedResumeData, 
      });
    }

    // 4. CALCULATE AND SAVE RESUME SCORE (Only if user exists)
    if (userId) {
      await calculateAndSaveResumeScore(userId, generatedResumeData);
    }
    
    // 5. Download and Response Logic
    if (structuredData.download) {
      // PDF service uses the full structured object
      const pdfBuffer = await generateResumePDF(generatedResumeData); 
      const base64 = pdfBuffer.toString("base64");
      const fileName = `${generatedResumeData.jobTitle.replace(/[^a-z0-9]/gi, "_")}_Resume.pdf`;

      return res.status(200).json({
        fileName,
        contentType: "application/pdf",
        base64,
        resume: generatedResumeData, // Return structured data
        saved: !!savedResume,
        resumeId: savedResume?._id || null,
      });
    }

    // Default: Return the generated structured data object for the frontend to update state
    res.status(200).json({
      resume: generatedResumeData, 
      saved: !!savedResume,
      resumeId: savedResume?._id || null,
    });
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    res.status(500).json({ msg: "Failed to generate resume", error: error.message });
  }
};

// Save resume manually (Logic remains correct for structured data flow)
const saveResume = async (req, res) => {
  try {
    const structuredData = req.body; // Expect the full ResumeData object
    const userId = req.user?._id;
    
    if (!structuredData || !userId) {
      return res.status(400).json({ msg: "Missing data or user not authenticated." });
    }

    const saved = await Resume.create({
      user: userId,
      sections: structuredData, // Save structured data
    });

    // CALCULATE AND SAVE RESUME SCORE
    await calculateAndSaveResumeScore(userId, structuredData);

    res.status(201).json({ msg: "Resume saved.", resumeId: saved._id });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save resume", error: err.message });
  }
};

module.exports = {
  generateResumeHandler,
  saveResume,
  // ... (include other exports like getResumeHistory, downloadResumePDF)
};