// services/geminiService.js

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env file.");
}

let genAI = null;
let model = null;
// Use a model that supports Structured Output (JSON Schema) well
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

// --- MOCK DATA ---
const getMockQuestion = () => {
  return "AI Service Unavailable. Please check your API Key.";
};

const getMockFeedback = () => {
  return "AI Service Unavailable.";
};

/**
 * ⭐ STRICT JSON SCHEMA
 * This tells Gemini EXACTLY what fields to return.
 */
const resumeSchema = {
    type: SchemaType.OBJECT,
    properties: {
        name: { type: SchemaType.STRING, description: "Full Name" },
        email: { type: SchemaType.STRING, description: "Email Address" },
        phone: { type: SchemaType.STRING, description: "Phone Number" },
        location: { type: SchemaType.STRING, description: "City, Country" },
        jobTitle: { type: SchemaType.STRING, description: "Professional Job Title" },
        summary: { type: SchemaType.STRING, description: "Professional summary (3-4 sentences)" },

        skills: { 
            type: SchemaType.ARRAY, 
            description: "List of 8-15 relevant skills",
            items: { type: SchemaType.STRING } 
        },
        languages: { 
            type: SchemaType.ARRAY, 
            description: "Languages spoken",
            items: { type: SchemaType.STRING } 
        },

        experience: {
            type: SchemaType.ARRAY,
            description: "Work experience entries. Generate 2-3 if missing.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    role: { type: SchemaType.STRING },
                    company: { type: SchemaType.STRING },
                    duration: { type: SchemaType.STRING, description: "e.g. 'Jan 2022 - Present'" },
                    description: { type: SchemaType.STRING, description: "Bullet points describing achievements" },
                },
                required: ["role", "company", "description"], 
            },
        },

        education: {
            type: SchemaType.ARRAY,
            description: "Education entries",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    degree: { type: SchemaType.STRING },
                    institution: { type: SchemaType.STRING },
                    year: { type: SchemaType.STRING },
                    gpa: { type: SchemaType.STRING },
                },
                required: ["degree", "institution"],
            },
        },

        projects: {
            type: SchemaType.ARRAY,
            description: "Project entries. Generate 2 if missing.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    techStack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    link: { type: SchemaType.STRING },
                },
                required: ["title", "description"],
            },
        },

        certifications: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    issuer: { type: SchemaType.STRING },
                    date: { type: SchemaType.STRING },
                },
                required: ["title"],
            },
        },
    },
    required: ["name", "jobTitle", "summary", "skills", "experience", "education", "projects"],
};

/**
 * ⭐ GENERATE FULL TEXT (Now with Schema Validation)
 */
const generateFullText = async (prompt) => {
  if (!model) {
    console.log("⚠️ No AI Model available. Returning mock text.");
    return JSON.stringify({ summary: "Mock Resume Data (AI unavailable)" });
  }

  try {
    // We add generationConfig to force JSON output structure
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      }
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ REAL AI ERROR (generateFullText):", error.message);
    
    // Fallback if schema validation fails on the API side (rare with flash-1.5/2.0)
    if (error.message.includes("generationConfig")) {
        console.log("🔄 Retrying without strict schema...");
        try {
            const retryResult = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt + " \nReturn strictly valid JSON." }] }]
            });
            return retryResult.response.text();
        } catch (retryErr) {
            console.error("❌ Retry failed:", retryErr.message);
        }
    }
    
    // Return a minimal valid JSON to prevent backend crash
    return JSON.stringify({
        name: "Error Generating",
        jobTitle: "Please Try Again",
        summary: "The AI service is currently experiencing high traffic or an error.",
        skills: [],
        experience: [],
        education: [],
        projects: []
    });
  }
};

const generateTextStream = async function* (prompt) {
    // Stream implementation (unchanged for now, usually used for chat)
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
        console.error("Stream Error:", error);
        yield "Error generating text.";
    }
};

module.exports = { generateTextStream, generateFullText };