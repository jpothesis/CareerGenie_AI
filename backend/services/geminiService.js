// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Streaming version
const generateTextStream = async function* (prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText =
        chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (chunkText) yield chunkText;
    }
  } catch (error) {
    console.error("Gemini Streaming API Error:", error.message);
    throw new Error("Failed to get streaming response from Gemini");
  }
};

// Non-streaming fallback
const generateFullText = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to get full response from Gemini");
  }
};

module.exports = { generateTextStream, generateFullText };
