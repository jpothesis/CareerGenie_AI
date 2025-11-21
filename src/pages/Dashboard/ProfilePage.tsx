import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import bgImage from "../../assets/background.png";
import { FaUserEdit, FaSave, FaSpinner } from 'react-icons/fa';
import ProfilePreview from "../../components/ProfilePreview";
import ProfileForm from "../../components/ProfileForm";

// Define the shape of the form state
interface FormState {
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  skills: string;
  profilePic: string;
  experience: string;
  education: string;
  website: string;
  github: string;
  linkedin: string;
  yearsExperience: string;
}

const initialFormState: FormState = {
  fullName: "", headline: "", bio: "", location: "", skills: "",
  profilePic: "https://via.placeholder.com/150?text=Profile",
  experience: "", education: "", website: "", github: "",
  linkedin: "", yearsExperience: "",
};

// --- Utility Classes (useMemo is good practice for static props) ---
const coolButtonClasses = "w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.01] shadow-2xl hover:shadow-orange-500/50";
const cardClasses = "bg-[#1a1a1a]/80 p-6 rounded-xl border border-orange-500/20 shadow-xl transition-all duration-500 hover:shadow-orange-500/30";


const ProfilePage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLDivElement | null>(null);

  // Fetch profile logic
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile/me");
        if (res.data) {
          const { skills, profilePic, ...rest } = res.data;
          setForm(prevForm => ({
            ...prevForm,
            ...rest,
            skills: skills?.join(", ") || prevForm.skills,
            profilePic: profilePic || prevForm.profilePic,
          }));
        }
      } catch (err: any) {
        console.error(err);
        setMessage("⚠️ No profile found. You can create one below.");
      }
    };
    fetchProfile();
  }, []);

  // Scroll to message on update
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  // Handler for all input changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Save profile submission handler
  const saveProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/profile", form);
      setMessage("✅ Profile saved successfully! Your masterpiece is live.");
      setForm(prevForm => ({
        ...prevForm,
        skills: res.data.skills?.join(", ") || prevForm.skills
      }));
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Failed to save profile: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [form]);

  // Styles for the main container
  const containerStyle = useMemo(() => ({
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundColor: "rgba(0,0,0,0.8)",
    backgroundBlendMode: "overlay"
  }), []);


  return (
    <div className="min-h-screen px-6 py-12 text-white" style={containerStyle}>
      <div className="max-w-7xl mx-auto backdrop-blur-sm p-8 rounded-3xl border border-orange-500/20 bg-[#1a1a1a]/70 shadow-2xl shadow-orange-500/10 animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text flex items-center justify-center">
          <FaUserEdit className="mr-3 text-orange-400" /> MASTER PROFILE EDITOR
        </h1>

        <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* --- Left Column: Preview (1/4) --- */}
          <div className="md:col-span-1">
            <ProfilePreview form={form} cardClasses={cardClasses} />
          </div>

          {/* --- Right Column: Main Form Fields (3/4) --- */}
          <div className="md:col-span-3 space-y-8">
            <ProfileForm form={form} handleChange={handleChange} cardClasses={cardClasses} />

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${coolButtonClasses} ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" /> Saving Changes...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaSave className="mr-2" /> Save Your Master Profile
                </span>
              )}
            </button>

            {/* Feedback Message */}
            {message && (
              <div
                ref={messageRef}
                className="mt-8 p-4 bg-black/50 border border-green-500/20 rounded-lg animate-fade-in max-h-48 overflow-y-auto shadow-2xl shadow-green-500/10"
              >
                <p className="whitespace-pre-wrap text-sm text-white">{message}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;