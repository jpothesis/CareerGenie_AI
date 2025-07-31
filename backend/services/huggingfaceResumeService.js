const axios = require("axios");

const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

const generateResume = async ({
  name,
  jobTitle,
  skills,
  experience,
  education,
  projects,
  jobDescription
}) => {
  const prompt = `
You are an expert resume builder. Based on the following details, generate a professional resume in strict JSON format with the fields: summary, skills, experience, education, and projects.

Name: ${name}
Job Title: ${jobTitle}
Skills: ${skills.join(", ")}
Experience: ${experience.join("\\n")}
Education: ${education?.join("\\n") || "N/A"}
Projects: ${projects?.join("\\n") || "N/A"}
Job Description: ${jobDescription || "N/A"}

Only respond with valid JSON like this:
{
  "summary": "A brief professional summary...",
  "skills": ["Skill 1", "Skill 2"],
  "experience": ["Experience bullet 1", "Experience bullet 2"],
  "education": ["Education item 1", "Education item 2"],
  "projects": ["Project 1", "Project 2"]
}
`;

  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const rawText = response.data?.[0]?.generated_text;

    if (!rawText) throw new Error("Empty response from Hugging Face");

    // Attempt to extract and parse valid JSON block using regex (Mistral sometimes adds extra text)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return JSON:\n" + rawText);

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;

  } catch (err) {
    console.error("Hugging Face Resume Error:", err.response?.data || err.message);
    throw new Error("Failed to generate resume");
  }
};

module.exports = { generateResume };
