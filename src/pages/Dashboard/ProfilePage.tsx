"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ProfileData } from "../../api/profileApi"; // use type-only import
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "../../api/profileApi";
import bgImage from "../../assets/background.png";
import { FaUserEdit, FaSave, FaSpinner } from "react-icons/fa";
import ProfilePreview from "../../components/ProfilePreview";
import ProfileForm from "../../components/ProfileForm";
import placeholderImage from "../../assets/profile-placeholder.png";
import { useNavigate } from "react-router-dom";


interface FormState {
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  skills: string; // comma-separated for frontend
  profilePic: string;
  experience: string;
  education: string;
  website: string;
  github: string;
  linkedin: string;
  yearsExperience: number; // keep number internally
}

const initialFormState: FormState = {
  fullName: "",
  headline: "",
  bio: "",
  location: "",
  skills: "",
    profilePic: placeholderImage,
  experience: "",
  education: "",
  website: "",
  github: "",
  linkedin: "",
  yearsExperience: 0,
};

const coolButtonClasses = "w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.01] shadow-2xl hover:shadow-orange-500/50";
const cardClasses = "bg-[#1a1a1a]/80 p-6 rounded-xl border border-orange-500/20 shadow-xl transition-all duration-500 hover:shadow-orange-500/30";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate(); 
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setForm(prev => ({
          ...prev,
          fullName: data.fullName || "",
          headline: data.headline || "",
          bio: data.bio || "",
          location: data.location || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "",
          profilePic: data.profilePic || prev.profilePic,
          experience: data.experience || "",
          education: data.education || "",
          website: data.website || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : 0,
        }));
        setMessage("");
      } catch (err: any) {
        console.error(err);
        setMessage("⚠️ No profile found. You can create one below.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return alert("Please select a file first!");
    setLoading(true);
    setMessage("");

    try {
      const data = await uploadProfilePicture(selectedFile);
      setForm(prev => ({ ...prev, profilePic: data.profileImage }));
      setMessage("✅ Profile picture uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Failed to upload picture: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
        // Convert form into backend-friendly format
        const payload: ProfileData = {
          ...form,
          skills: form.skills.split(",").map(s => s.trim()),
          yearsExperience: form.yearsExperience.toString(), // backend expects string
        };

        await updateUserProfile(payload);

        setMessage("✅ Profile saved successfully!");
      } catch (err: any) {
        console.error(err);
        setMessage(`❌ Failed to save profile: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <div
      className="min-h-screen px-6 py-12 text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundColor: "rgba(0,0,0,0.8)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-7xl mx-auto backdrop-blur-sm p-8 rounded-3xl border border-orange-500/20 bg-[#1a1a1a]/70 shadow-2xl shadow-orange-500/10 animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text flex items-center justify-center">
          <FaUserEdit className="mr-3 text-orange-400" /> MASTER PROFILE EDITOR
        </h1>

        <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <ProfilePreview form={form} cardClasses={cardClasses} />
            <div className="mt-4">
              <input type="file" onChange={handleFileChange} />
              <button
                type="button"
                onClick={handleUploadPicture}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Upload Picture
              </button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <ProfileForm form={form} handleChange={handleChange} cardClasses={cardClasses} />

            <button
              type="submit"
              disabled={loading}
              className={`${coolButtonClasses} ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black"
              }`}
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
