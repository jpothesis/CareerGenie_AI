import { useState } from "react";
import axios from "axios";
import InputField from "../../components/InputField"; // Make sure you have this
import TextAreaField from "../../components/TextAreaField";
 // Optional
import bgImage from "../../assets/background.png"; // Add your bg image

const CareerAdvisor = () => {
  const [form, setForm] = useState({
    name: "",
    education: "",
    skills: "",
    interests: "",
    goals: "",
  });

  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdvice("");

    try {
      const response = await axios.post("/api/career/advice", {

        ...form,
        skills: form.skills.split(",").map((skill) => skill.trim()),
        interests: form.interests.split(",").map((interest) => interest.trim()),
      });

      setAdvice(response.data.advice);
    } catch (error: any) {
      setAdvice("❌ Failed to generate advice. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat bg-center px-6 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl mx-auto backdrop-blur-md p-6 rounded-2xl border border-orange-500/20 bg-[#1a1a1a]/70">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          🚀 AI Career Advisor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            label="Full Name"
            required
          />

          <InputField
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Education (e.g., B.Tech CSE)"
            label="Education"
            required
          />

          <InputField
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            label="Skills"
            required
          />

          <InputField
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Interests (comma separated)"
            label="Interests"
            required
          />

          <TextAreaField
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="Describe your career goals"
            label="Career Goals"
            rows={4}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
          >
            {loading ? "🔄 Generating..." : "✨ Get Career Advice"}
          </button>
        </form>

        {advice && (
          <div className="mt-8 p-6 bg-[#111827] border border-green-500/20 rounded-lg animate-fade-in">
            <h2 className="text-lg font-bold text-green-400 mb-2">Your AI Career Advice:</h2>
            <p className="whitespace-pre-wrap text-sm text-white">{advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAdvisor;
