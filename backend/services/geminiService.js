// services/geminiService.js

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env file.");
}


// Initialize Gemini
// This will automatically use process.env.GEMINI_API_KEY if available.
let genAI = null;
let model = null;
const MODEL_NAME = "gemini-2.5-flash";

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
  } else {
    console.warn("⚠️ WARNING: GEMINI_API_KEY is missing. Using Mock Mode.");
  }
} catch (err) {
  console.error("❌ Error initializing Gemini:", err.message);
}

// --- MOCK DATA GENERATORS ---
const getMockQuestion = () => {
  return "This is a MOCK interview question because the AI Service failed. \n\nTell me about a challenging technical problem you solved recently?";
};

const getMockFeedback = () => {
  return "SCORE: 3/5\n\nThis is MOCK feedback. The AI service could not be reached.\n\nStrengths: Good attempt.\nWeaknesses: API Key missing.";
};


/**
 * ⭐ STRICT JSON SCHEMA for structured resume output
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
                required: ["role", "company", "description"], 
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
                required: ["degree", "institution", "year"],
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
                required: ["title", "description"],
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
                required: ["title"],
            },
        },
    },

    required: [
        "name", "jobTitle", "summary", "skills", "experience", "education",
    ],
};

/**
 * ⭐ Generate structured resume JSON using Gemini
 */
const generateFullText = async (prompt) => {
  if (!model) {
    console.log("⚠️ No AI Model available. Returning mock text.");
    return getMockQuestion();
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ REAL AI ERROR (generateFullText):", error.message);
    console.log("🔄 Switching to Fallback/Mock response...");
    return getMockQuestion(); // <--- PREVENTS 500 ERROR
  }
};

const generateTextStream = async function* (prompt) {
  if (!model) {
    yield getMockFeedback();
    return;
  }

  try {
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (chunkText) yield chunkText;
    }
  } catch (error) {
    console.error("❌ REAL AI ERROR (Stream):", error.message);
    yield "\n[System Error: AI connection failed. Using Mock Data.]\n";
    yield getMockFeedback(); // <--- PREVENTS 500 ERROR
  }
};

module.exports = { generateTextStream, generateFullText };