const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Stream Gemini response chunk-by-chunk
 * @param {string} prompt
 */
const generateTextStream = async function* (prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

/**
 * Get the full Gemini response as a string
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const generateFullText = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText =
        chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
      fullText += chunkText;
    }
    return fullText.trim();
  } catch (error) {
    console.error("Gemini Streaming API Error:", error.message);
    throw new Error("Failed to get full response from Gemini");
  }
};

module.exports = { generateTextStream, generateFullText };
