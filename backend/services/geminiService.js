const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    return reply;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to get response from Gemini");
  }
};

module.exports = { getGeminiResponse };
