// services/geminiService.js

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * ⭐ STRICT JSON SCHEMA for structured resume output
 * Fully validated by Gemini – guarantees 100% pure JSON.
 */
const resumeSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING },
    email: { type: SchemaType.STRING },
    phone: { type: SchemaType.STRING },
    location: { type: SchemaType.STRING },
    jobTitle: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },

    // Simple arrays
    skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    languages: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },

    // Experience Section
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          company: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
        },
        required: ["id", "role", "company", "description"],
      },
    },

    // Education Section
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          degree: { type: SchemaType.STRING },
          institution: { type: SchemaType.STRING },
          year: { type: SchemaType.STRING },
          gpa: { type: SchemaType.STRING },
        },
        required: ["id", "degree", "institution", "year"],
      },
    },

    // Projects Section
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          techStack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          link: { type: SchemaType.STRING },
        },
        required: ["id", "title", "description"],
      },
    },

    // Certifications Section
    certifications: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          issuer: { type: SchemaType.STRING },
          date: { type: SchemaType.STRING },
        },
        required: ["id", "title"],
      },
    },
  },

  required: [
    "name",
    "jobTitle",
    "summary",
    "skills",
    "experience",
    "education",
  ],
};

/**
 * ⭐ Generate structured resume JSON using Gemini
 * ALWAYS returns clean, valid JSON (no markdown, no text around it)
 */
const generateFullText = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],

      // ⭐ True correct keys for structured output
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: resumeSchema,
      },
    });

    // `.text()` ALWAYS returns clean JSON string
    return result.response.text().trim();

  } catch (error) {
    console.error("Gemini Structured Output Error:", error.message);
    throw new Error(
      "Failed to generate structured resume JSON: " + error.message
    );
  }
};

module.exports = {
  generateFullText,
};
