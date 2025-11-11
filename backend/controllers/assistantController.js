/*
const ActivityLog = require('../models/ActivityLog');
//const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fetch assistant usage history for the logged-in user
exports.getAssistantData = async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      user: req.user.id,
      type: 'assistant'
    }).sort({ createdAt: -1 });

    res.status(200).json({ logs });
  } catch (error) {
    console.error("Assistant Data Fetch Error:", error);
    res.status(500).json({ msg: 'Failed to fetch assistant history', error: error.message });
  }
};

// Ask OpenAI assistant and log activity
exports.askAI = async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ msg: "Prompt is required" });
    }

    // Log assistant usage
    await ActivityLog.create({
      user: req.user.id,
      type: 'assistant',
      platform: req.headers['user-agent']?.toLowerCase().includes('mobile') ? 'mobile' : 'desktop',
      description: `Asked assistant: ${userPrompt}`
    });

    // Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4.0",
      messages: [
        {
          role: "system",
          content: "You are CareerGenie, a helpful career assistant. Provide short, helpful answers about jobs, resumes, interviews, and tech skills.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const assistantReply = completion.choices[0]?.message?.content || "I couldn't find a response.";

    res.status(200).json({
      response: assistantReply,
    });

  } catch (error) {
    console.error("Assistant Error:", error);
    res.status(500).json({ msg: 'Failed to fetch assistant response', error: error.message });
  }
};
*/