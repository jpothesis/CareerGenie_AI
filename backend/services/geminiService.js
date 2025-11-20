const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env file.");
}
// services/geminiService.js

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

// Initialize Gemini
// This will automatically use process.env.GEMINI_API_KEY if available.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],

            config: { 
                responseMimeType: "application/json",
                responseSchema: resumeSchema,
            },
        });

        // Basic safety check for content being blocked (e.g., safety filters)
        if (result.response.promptFeedback && result.response.promptFeedback.blockReason) {
            throw new Error(`Gemini blocked the prompt: ${result.response.promptFeedback.blockReason}`);
        }
        
        // Ensure non-empty response
        const responseText = result.response.text.trim();
        if (!responseText) {
            throw new Error("Gemini returned an empty response text.");
        }

        return responseText;

    } catch (error) {
        // Catch and rethrow explicit API errors for the controller to handle.
        console.error("Gemini Structured Output Error:", error.message);
        throw new Error(
            "Gemini API Call Failed: " + error.message
        );
    }
};

module.exports = {
    generateFullText,
};