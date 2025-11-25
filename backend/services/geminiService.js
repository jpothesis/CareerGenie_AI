// services/geminiService.js

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env file.");
}

let genAI = null;
let model = null;
// Use flash model for speed
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

// --- 1. STRUCTURED DATA (JSON) ---
const generateStructuredData = async (prompt, responseSchema) => {
  if (!model) return JSON.stringify({ error: "AI Service Unavailable" });

  try {
    const generationConfig = {
      responseMimeType: "application/json",
    };

    if (responseSchema) {
      generationConfig.responseSchema = responseSchema;
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("❌ GEMINI JSON ERROR:", error.message);
    // Retry logic
    if (error.message.includes("generationConfig")) {
        try {
            const retryResult = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt + " \nReturn strictly valid JSON." }] }]
            });
            return retryResult.response.text();
        } catch (retryErr) {
            console.error("Retry failed:", retryErr.message);
        }
    }
    throw error;
  }
};

// --- 2. PLAIN TEXT (For Questions/Chat) ---
const generateText = async (prompt) => {
  if (!model) return "AI Service Unavailable. Please check your API Key.";

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return result.response.text();
  } catch (error) {
    console.error("❌ GEMINI TEXT ERROR:", error.message);
    throw error;
  }
};

// --- 3. STREAMING TEXT (For Live Feedback) ---
const generateStream = async function* (prompt) {
    if (!model) {
        yield "AI Service Unavailable.";
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
        console.error("❌ GEMINI STREAM ERROR:", error.message);
        yield "Error generating stream.";
    }
};

module.exports = { 
    generateStructuredData, 
    generateText, 
    generateStream,
    SchemaType 
};