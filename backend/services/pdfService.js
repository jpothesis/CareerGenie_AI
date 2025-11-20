// services/pdfService.js

import getStream from "get-stream";
import PDFDocument from "pdfkit";

// ⭐️ Input is now the full structured ResumeData object (which the controller passes)
export const generateResumePDF = async (structuredData) => { 
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {});

  // ⭐️ Access data directly from the structuredData object
  doc.fontSize(24).text(structuredData.name, { align: "center" });
  doc.fontSize(18).text(structuredData.jobTitle, { align: "center" });
  doc.moveDown();

  // Summary
  if (structuredData.summary) {
    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12).text(structuredData.summary);
    doc.moveDown();
  }

  // Education
  if (structuredData.education && structuredData.education.length > 0) {
    doc.fontSize(14).text("Education", { underline: true });
    // ⭐️ Uses the structured properties (degree, institution, year)
    structuredData.education.forEach((edu) => {
      doc.fontSize(12).text(`${edu.degree} - ${edu.institution} (${edu.year})`);
    });
    doc.moveDown();
  }

  // Experience
  if (structuredData.experience && structuredData.experience.length > 0) {
    doc.fontSize(14).text("Experience", { underline: true });
    // ⭐️ Uses the structured properties (role, company, duration)
    structuredData.experience.forEach((exp) => {
      doc.fontSize(12).text(`${exp.role} at ${exp.company} (${exp.duration})`);
    });
    doc.moveDown();
  }
  
  // Skills
  if (structuredData.skills && structuredData.skills.length > 0) {
    doc.fontSize(14).text("Skills", { underline: true });
    doc.fontSize(12).text(structuredData.skills.join(", "));
    doc.moveDown();
  }

  // Projects
  if (structuredData.projects && structuredData.projects.length > 0) {
    doc.fontSize(14).text("Projects", { underline: true });
    // ⭐️ Uses the structured properties (title, description)
    structuredData.projects.forEach((p) => {
      doc.fontSize(12).text(`${p.title}: ${p.description}`);
    });
    doc.moveDown();
  }

  doc.end();

  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
};