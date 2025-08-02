// services/pdfService.js
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

const generateResumePDF = async ({ name, jobTitle, sections }) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(24).text(name, { align: "center" });
  doc.fontSize(18).text(jobTitle, { align: "center" });
  doc.moveDown();

  // Summary
  if (sections.summary) {
    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12).text(sections.summary);
    doc.moveDown();
  }

  // Education
  if (sections.education && sections.education.length > 0) {
    doc.fontSize(14).text("Education", { underline: true });
    sections.education.forEach((edu) => {
      doc.fontSize(12).text(`${edu.degree} - ${edu.institution} (${edu.year})`);
    });
    doc.moveDown();
  }

  // Experience
  if (sections.experience && sections.experience.length > 0) {
    doc.fontSize(14).text("Experience", { underline: true });
    sections.experience.forEach((exp) => {
      doc.fontSize(12).text(`${exp.role} at ${exp.company} (${exp.duration})`);
    });
    doc.moveDown();
  }

  // Skills
  if (sections.skills && sections.skills.length > 0) {
    doc.fontSize(14).text("Skills", { underline: true });
    doc.fontSize(12).text(sections.skills.join(", "));
    doc.moveDown();
  }

  // Projects
  if (sections.projects && sections.projects.length > 0) {
    doc.fontSize(14).text("Projects", { underline: true });
    sections.projects.forEach((p) => {
      doc.fontSize(12).text(`${p.title}: ${p.description}`);
    });
    doc.moveDown();
  }

  doc.end();

  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
};

module.exports = { generateResumePDF };