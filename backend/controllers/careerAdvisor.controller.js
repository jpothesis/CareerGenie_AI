const { generateFullText } = require("../services/geminiService");

const generateCareerAdvice = async (req, res) => {
  try {
    const { name, education, skills, interests, goals } = req.body;

    if (!name || !education || !skills || !interests || !goals) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const prompt = `
You are a professional career advisor. A user has provided the following profile:

- Name: ${name}
- Education: ${education}
- Skills: ${skills.join(", ")}
- Interests: ${interests.join(", ")}
- Career Goals: ${goals}

Give a personalized career path recommendation in 2–3 paragraphs. Mention:
- Suggested job roles
- Skills to focus on
- Learning resources or platforms
- Resume or profile tips
Avoid repeating the input.
    `;

    const advice = await generateFullText(prompt);
    res.status(200).json({ advice });
  } catch (error) {
    console.error("Career Advice Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate career advice" });
  }
};

module.exports = { generateCareerAdvice };
