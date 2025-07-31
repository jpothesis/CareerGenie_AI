const Resume = require("../models/Resume");
const { generateResume } = require("../services/huggingfaceResumeService");
const { generateResumePDF } = require("../services/pdfService");

const generateResumeHandler = async (req, res) => {
  try {
    const { name, jobTitle, skills, experience, education, projects, jobDescription } = req.body;

    const result = await generateResume({
      name,
      jobTitle,
      skills,
      experience,
      education,
      projects,
      jobDescription,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate resume", error: err.message });
  }
};

const saveResume = async (req, res) => {
  try {
    const { education, experience, skills, projects, summary } = req.body;

    const resume = await Resume.create({
      user: req.user._id,
      sections: {
        education,
        experience,
        skills,
        projects,
        summary,
      },
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ msg: "Failed to save resume", error: err.message });
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ lastUpdated: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch resumes", error: err.message });
  }
};

const downloadResumePDF = async (req, res) => {
  try {
    const { name, jobTitle, sections } = req.body;

    const pdfBuffer = await generateResumePDF({
      name,
      jobTitle,
      sections,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${jobTitle.replace(/ /g, "_")}_Resume.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate PDF", error: err.message });
  }
};

module.exports = {
  generateResumeHandler,
  saveResume,
  getResumeHistory,
  downloadResumePDF,
};
