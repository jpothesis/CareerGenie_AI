import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Download, Pencil } from "lucide-react";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    summary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleDownload = () => {
    // You can integrate jsPDF or html2pdf here
    alert("Download triggered. Implement PDF export here.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-stone-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-orange-400 mb-6 flex items-center gap-2"
        >
          <FileText className="text-orange-500" /> Resume Builder
        </motion.h1>

        <div className="grid gap-4 bg-stone-800 p-6 rounded-xl shadow-xl">
          {[
            { label: "Full Name", name: "name" },
            { label: "Email", name: "email" },
            { label: "Phone", name: "phone" },
            { label: "Education", name: "education" },
            { label: "Work Experience", name: "experience" },
            { label: "Skills", name: "skills" },
            { label: "Professional Summary", name: "summary", isTextArea: true },
          ].map(({ label, name, isTextArea }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <label className="text-stone-300 text-sm font-semibold">{label}</label>
              {isTextArea ? (
                <textarea
                  name={name}
                  value={resumeData[name as keyof typeof resumeData]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded bg-stone-700 border border-stone-600 text-white resize-none"
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  name={name}
                  value={resumeData[name as keyof typeof resumeData]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 rounded bg-stone-700 border border-stone-600 text-white"
                />
              )}
            </motion.div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-black font-bold shadow hover:bg-orange-400 transition"
            >
              <Download /> Download PDF
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-700 text-white font-semibold border border-stone-500 hover:bg-stone-600 transition"
            >
              <Upload /> Import Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
