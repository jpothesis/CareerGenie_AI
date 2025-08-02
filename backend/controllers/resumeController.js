const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");
const { generateResumePDF } = require("../services/pdfService");

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Resume using Gemini
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

    if (!name || !jobTitle) {
      return res.status(400).json({ msg: "Name and job title are required." });
    }

    // Prompt for Gemini
    const prompt = `
    You are a professional resume builder. Based on the following candidate information, generate a clean, ATS-friendly professional resume in **plain text only**.
    
    The resume should include:
    1. A brief professional summary (2–4 lines) that highlights the candidate’s strengths, skills, and overall experience.
    2. A well-structured resume with sections for Skills, Experience, Education, and Projects.
    3. Use standard resume formatting — no Markdown, HTML, or extra commentary.
    
    ---
    
    **Candidate Information**
    
    Name: ${name}  
    Job Title: ${jobTitle}  
    Skills: ${skills.join(", ")}  
    Experience: ${experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join("; ")}  
    Education: ${education.map(e => `${e.degree}, ${e.institution} (${e.year})`).join("; ")}  
    Projects: ${projects.map(p => `${p.title}: ${p.description}`).join("; ")}
    
    ---
    
    Please generate only the resume in plain text.`;
    

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resumeText = response.text();

    // Save to DB if requested
    let savedResume = null;
    if (save && req.user?._id) {
      savedResume = await Resume.create({
        user: req.user._id,
        sections: { raw: resumeText },
      });
    }

    // Download PDF if requested
    if (download) {
      const pdfBuffer = await generateResumePDF({
        name,
        jobTitle,
        sections: { raw: resumeText },
      });

      const fileName = `${jobTitle.replace(/[^a-z0-9]/gi, "_")}_Resume.pdf`;
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}`,
      });
      return res.send(pdfBuffer);
    }

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
    const { sections } = req.body;
    if (!sections || !req.user?._id) {
      return res.status(400).json({ msg: "Missing data or user not authenticated." });
    }

    const saved = await Resume.create({
      user: req.user._id,
      sections,
    });

    res.status(201).json({ msg: "Resume saved.", resumeId: saved._id });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save resume", error: err.message });
  }
};

// Resume history
const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch history", error: err.message });
  }
};

// Download resume PDF from saved sections
const downloadResumePDF = async (req, res) => {
  try {
    const { name, jobTitle, sections } = req.body;
    if (!name || !jobTitle || !sections) {
      return res.status(400).json({ msg: "Incomplete resume data." });
    }

    const pdfBuffer = await generateResumePDF({ name, jobTitle, sections });

    const fileName = `${jobTitle.replace(/[^a-z0-9]/gi, "_")}_Resume.pdf`;
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });
    res.send(pdfBuffer);
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
