import { useState } from "react";
import { generateResume } from "../../api/resumeApi"; // ✅ use API function
import { EducationForm } from "../../components/EducationForm";
import { ProjectForm } from "../../components/ProjectForm";
import { ExperienceForm } from "../../components/ExperienceForm";
import { Button } from "../../components/ui/button";
import InputField from "../../components/InputField";
import SkillInput from "../../components/SkillInput";
import resumeBg from "../../assets/background.png";

type Experience = { role: string; company: string; duration: string; description: string };
type Education = { degree: string; institution: string; year: string };
type Project = { title: string; description: string; techStack: string[]; link: string };

const ResumeBuilder = () => {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [save, setSave] = useState(false);
  const [download, setDownload] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [pdfBase64, setPdfBase64] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async () => {
    try {
      const summary = `Name: ${name}\nTitle: ${jobTitle}`;

      // ✅ Call backend through API layer (token attached automatically)
      const data = await generateResume({
        name,
        jobTitle,
        skills,
        experience,
        education,
        projects,
        summary,
        save,
        download,
      });

      setResumeText(data.resume);

      if (data.base64) {
        setPdfBase64(data.base64);
        setFileName(data.fileName);
      }
    } catch (err) {
      console.error("Error generating resume:", err);
      alert("Something went wrong while generating resume.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-6 py-8 text-white"
      style={{
        backgroundImage: `url(${resumeBg})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-5xl mx-auto backdrop-blur-sm p-4 rounded-xl">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          ✨ Build Your Resume
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="fullName"
            placeholder="Enter your full name"
            autoComplete="name"
          />
          <InputField
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            name="jobTitle"
            placeholder="e.g. Frontend Developer"
            autoComplete="organization-title"
          />
        </div>

        <SkillInput skills={skills} setSkills={setSkills} />
        <ExperienceForm experiences={experience} setExperiences={setExperience} />
        <EducationForm education={education} setEducation={setEducation} />
        <ProjectForm projects={projects} setProjects={setProjects} />

        <div className="flex items-center gap-4 mt-6 mb-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={save}
              onChange={() => setSave(!save)}
              className="accent-yellow-500"
            />
            Save to Profile
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={download}
              onChange={() => setDownload(!download)}
              className="accent-yellow-500"
            />
            Download as PDF
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-2 py-3 text-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-bold rounded-lg hover:opacity-90 transition"
        >
          🚀 Generate Resume
        </button>

        {resumeText && (
          <div className="mt-8 bg-[#111827] border border-neutral-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-yellow-300">Generated Resume</h2>
            <pre className="whitespace-pre-wrap text-sm text-neutral-100">{resumeText}</pre>
          </div>
        )}

        {pdfBase64 && (
          <div className="mt-6">
            <a
              href={`data:application/pdf;base64,${pdfBase64}`}
              download={fileName}
              className="inline-block bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              📥 Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
