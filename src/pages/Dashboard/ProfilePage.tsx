import { useState, useEffect, useRef } from "react";
import axios from "axios";
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";
import bgImage from "../../assets/background.png";

const ProfilePage = () => {
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    skills: "",
    profilePic: "",
    experience: "",
    education: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLDivElement | null>(null);

  // Fetch current user's profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile/me");
        if (res.data) {
          setForm({
            fullName: res.data.fullName || "",
            headline: res.data.headline || "",
            bio: res.data.bio || "",
            location: res.data.location || "",
            skills: res.data.skills?.join(", ") || "",
            profilePic: res.data.profilePic || "",
            experience: res.data.experience || "",
            education: res.data.education || ""
          });
        }
      } catch (err) {
        console.error(err);
        setMessage("⚠️ No profile found. You can create one below.");
      }
    };
    fetchProfile();
  }, []);

  // Auto-scroll for feedback messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [message]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/profile", form);
      setMessage("✅ Profile saved successfully!");
      setForm({
        ...form,
        skills: res.data.skills?.join(", ") || ""
      });
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Failed to save profile: ${err.response?.data?.message || err.message}`);
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
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-4xl mx-auto backdrop-blur-md p-6 rounded-2xl border border-orange-500/20 bg-[#1a1a1a]/70">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          👤 My Profile
        </h1>

        <form onSubmit={saveProfile} className="space-y-4">
          <InputField
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            label="Full Name"
            required
          />

          <InputField
            name="headline"
            value={form.headline}
            onChange={handleChange}
            placeholder="Professional Headline"
            label="Headline"
          />

          <TextAreaField
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            label="Bio"
            rows={3}
          />

          <InputField
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            label="Location"
          />

          <InputField
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Comma separated skills (e.g., React, Node.js, MongoDB)"
            label="Skills"
          />

          <InputField
            name="profilePic"
            value={form.profilePic}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            label="Profile Picture URL"
          />

          <TextAreaField
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience details"
            label="Experience"
            rows={3}
          />

          <TextAreaField
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Education details"
            label="Education"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
          >
            {loading ? "🔄 Saving..." : "💾 Save Profile"}
          </button>
        </form>

        {message && (
          <div
            ref={messageRef}
            className="mt-8 p-6 bg-[#111827] border border-green-500/20 rounded-lg animate-fade-in max-h-64 overflow-y-auto"
          >
            <p className="whitespace-pre-wrap text-sm text-white">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
