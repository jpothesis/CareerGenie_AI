const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

const generateResumePDF = async ({ name, jobTitle, sections }) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Header
  doc.fontSize(20).text(name, { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text(`Job Title: ${jobTitle}`);
  doc.moveDown();

  // Summary
  if (sections.summary) {
    doc.fontSize(14).text("Summary:");
    doc.fontSize(12).text(sections.summary);
    doc.moveDown();
  }

  // Skills
  if (sections.skills?.length) {
    doc.fontSize(14).text("Skills:");
    doc.fontSize(12).text(sections.skills.join(", "));
    doc.moveDown();
  }

  // Education
  if (sections.education?.length) {
    doc.fontSize(14).text("Education:");
    sections.education.forEach(item => doc.fontSize(12).text(`• ${item}`));
    doc.moveDown();
  }

  // Experience
  if (sections.experience?.length) {
    doc.fontSize(14).text("Experience:");
    sections.experience.forEach(item => doc.fontSize(12).text(`• ${item}`));
    doc.moveDown();
  }

  // Projects
  if (sections.projects?.length) {
    doc.fontSize(14).text("Projects:");
    sections.projects.forEach(item => doc.fontSize(12).text(`• ${item}`));
    doc.moveDown();
  }

  doc.end();
  return await getStream.buffer(doc);
};

module.exports = { generateResumePDF };
