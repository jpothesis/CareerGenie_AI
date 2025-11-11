"use client";
import React, { useState, useEffect } from "react";

import type { Dispatch, SetStateAction } from "react";

// NOTE: Adjusted imports for Card, Button, Input, Badge for the final component
// Assuming these are available globally or imported correctly in a real project
// import { Card } from "../../components/ui/card"; 
// ...

import {
  FileText,
  Plus,
  Trash2,
  Wand2,
  Download,
  Save,
  Eye,
  Code,
  Briefcase,
  GraduationCap,
} from "lucide-react";

// --- TYPES ---
type Experience = { id: string; role: string; company: string; duration: string; description: string; };
type Education = { id: string; degree: string; institution: string; year: string; gpa?: string; };
type Project = { id: string; title: string; description: string; techStack: string[]; link: string; };
type Certification = { id: string; title: string; issuer: string; date: string; };
type ResumeData = { name: string; email: string; phone: string; location: string; jobTitle: string; summary: string; skills: string[]; experience: Experience[]; education: Education[]; projects: Project[]; certifications: Certification[]; languages: string[]; };

// --- INITIAL DATA & CONSTANTS ---
const INITIAL_RESUME_DATA: ResumeData = { name: "", email: "", phone: "", location: "", jobTitle: "", summary: "", skills: [], experience: [], education: [], projects: [], certifications: [], languages: [], };

const TEMPLATES = [
  { id: "modern", name: "Modern 🔥", color: "from-orange-500 to-amber-500" },
  { id: "professional", name: "Classic 💼", color: "from-gray-500 to-slate-500" },
  { id: "creative", name: "Creative ✨", color: "from-purple-500 to-pink-500" },
  { id: "minimal", name: "Clean 🧼", color: "from-green-500 to-teal-500" },
];

const SECTIONS = [
  { id: "personal", label: "Personal & Summary" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "additional", label: "Certifications & Languages" },
];

// --- FAKE AI GENERATION MOCK ---
const mockAIGeneratedData: ResumeData = {
  name: "Jaarvi Sharma",
  email: "jaarvi@uw-ac.in",
  phone: "(555) 123-4567",
  location: "New Delhi, India",
  jobTitle: "Senior Full-Stack Developer",
  summary:
    "Highly motivated and result-oriented Senior Full-Stack Developer with 5+ years of experience building scalable, high-performance web applications using React, Node.js, and modern cloud infrastructures. Proven ability to lead projects and mentor junior developers.",
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "Kubernetes", "CI/CD"],
  experience: [
    {
      id: "exp1",
      role: "Lead Software Engineer",
      company: "Innovatech Solutions",
      duration: "Jan 2022 - Present",
      description:
        "Led a team of 4 engineers to develop and deploy a next-gen CRM platform, improving client retention by 15%. Architected a microservices backbone using Node.js and deployed via AWS ECS.",
    },
    {
      id: "exp2",
      role: "Full-Stack Developer",
      company: "WebCraft Labs",
      duration: "Jul 2019 - Dec 2021",
      description:
        "Developed and maintained core features for high-traffic e-commerce sites, responsible for both front-end (React/Redux) and back-end (Express/MongoDB) systems.",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "B.Tech in Computer Science",
      institution: "Indian Institute of Technology (IIT)",
      year: "2015 - 2019",
      gpa: "9.2/10.0",
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "AI Resume Optimizer",
      description:
        "A web application built using Next.js and Tailwind CSS that uses a custom language model to optimize resume content for specific job descriptions.",
      techStack: ["Next.js", "Tailwind CSS", "LLM APIs"],
      link: "github.com/jaarvi/optimizer",
    },
  ],
  certifications: [
    {
      id: "cert1",
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Mar 2023",
    },
  ],
  languages: ["English (Native)", "Hindi (Fluent)"],
};

// --- SMALL REUSABLE FIELDS ---
interface InputFieldProps { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; }
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400">{label}</label>
    <input
      placeholder={placeholder || label}
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      type={type}
      className="w-full p-3 bg-black/30 border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
    />
  </div>
);

interface TextAreaFieldProps { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; }
const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400">{label}</label>
    <textarea
      placeholder={placeholder || label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full p-3 bg-black/30 border border-white/10 text-white placeholder:text-gray-500 rounded-lg resize-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
    />
  </div>
);

// Skill input section
interface SkillInputSectionProps { label: string; items: string[]; setInput: Dispatch<SetStateAction<string>>; input: string; addItem: () => void; removeItem: (index: number) => void; }
const SkillInputSection: React.FC<SkillInputSectionProps> = ({ label, items, setInput, input, addItem, removeItem }) => (
  <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl shadow-orange-400/20">
    <div className="p-4 border-b border-white/10">
      <h3 className="text-orange-400 text-lg font-semibold">{label}</h3>
    </div>
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          placeholder={`Add a ${label.toLowerCase().slice(0, -1)}`}
          value={input}
          onChange={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addItem()}
          className="w-full p-3 bg-black/30 border border-white/10 text-white placeholder:text-gray-500 rounded-lg"
        />
        <button onClick={addItem} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-lg p-3">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[30px]">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-medium cursor-pointer gap-2 border border-orange-500/50 transition-transform duration-150 ease-out hover:scale-[1.02]"
            onClick={() => removeItem(index)}
          >
            {item} <Trash2 className="h-3 w-3 text-red-400 hover:text-red-300" />
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Experience section (simplified props)
interface ExperienceSectionProps { experience: Experience[]; updateExperience: (id: string, field: string, value: string) => void; removeExperience: (id: string) => void; addExperience: () => void; }
const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, updateExperience, removeExperience, addExperience }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
      <Briefcase className="h-5 w-5 text-orange-400" /> Work Experience
    </h3>
    {experience.map((exp, idx) => (
      <div key={exp.id} className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-4">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-semibold text-orange-400">Entry #{idx + 1}</p>
          <button onClick={() => removeExperience(exp.id)} className="text-red-400 p-2 bg-transparent hover:bg-white/10 rounded-lg transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <InputField label="Job Title" value={exp.role} onChange={(v) => updateExperience(exp.id, "role", v)} placeholder="e.g. Senior Software Engineer" />
          <InputField label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} placeholder="e.g. Google" />
          <InputField label="Duration" value={exp.duration} onChange={(v) => updateExperience(exp.id, "duration", v)} placeholder="e.g. Jan 2020 - Dec 2022" />
          <TextAreaField label="Description (Key Achievements)" value={exp.description} onChange={(v) => updateExperience(exp.id, "description", v)} placeholder="Use bullet points" rows={3} />
        </div>
      </div>
    ))}
    <button onClick={addExperience} className="w-full bg-black/30 hover:bg-black/50 text-orange-400 font-medium rounded-lg p-3 flex justify-center items-center gap-2 border border-white/10 transition-colors">
      <Plus className="h-4 w-4" /> Add New Experience
    </button>
  </div>
);

// Education Section
interface EducationSectionProps { education: Education[]; updateEducation: (id: string, field: string, value: string) => void; removeEducation: (id: string) => void; addEducation: () => void; }
const EducationSection: React.FC<EducationSectionProps> = ({ education, updateEducation, removeEducation, addEducation }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
      <GraduationCap className="h-5 w-5 text-orange-400" /> Education
    </h3>
    {education.map((edu, idx) => (
      <div key={edu.id} className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-4">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-semibold text-orange-400">Entry #{idx + 1}</p>
          <button onClick={() => removeEducation(edu.id)} className="text-red-400 p-2 bg-transparent hover:bg-white/10 rounded-lg transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <InputField label="Degree/Field of Study" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} placeholder="e.g. B.Tech in Computer Science" />
          <InputField label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, "institution", v)} placeholder="e.g. Indian Institute of Technology" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Year" value={edu.year} onChange={(v) => updateEducation(edu.id, "year", v)} placeholder="e.g. 2019" />
            <InputField label="GPA/Percentage (optional)" value={edu.gpa || ""} onChange={(v) => updateEducation(edu.id, "gpa", v)} placeholder="e.g. 9.2/10.0" />
          </div>
        </div>
      </div>
    ))}
    <button onClick={addEducation} className="w-full bg-black/30 hover:bg-black/50 text-orange-400 font-medium rounded-lg p-3 flex justify-center items-center gap-2 border border-white/10 transition-colors">
      <Plus className="h-4 w-4" /> Add New Education
    </button>
  </div>
);

// ProjectsSection (keeps local state functions)
interface ProjectsSectionProps { projects: Project[]; setProjects: Dispatch<SetStateAction<Project[]>>; }
const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, setProjects }) => {
  const addProject = () => setProjects((prev) => [...prev, { id: Date.now().toString(), title: "", description: "", techStack: [], link: "" }]);
  const updateProject = (id: string, field: keyof Project, value: any) => setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const removeProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
        <Code className="h-5 w-5 text-orange-400" /> Key Projects
      </h3>
      {projects.map((proj, idx) => (
        <div key={proj.id} className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-4">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-orange-400">Project #{idx + 1}</p>
            <button onClick={() => removeProject(proj.id)} className="text-red-400 p-2 bg-transparent hover:bg-white/10 rounded-lg transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <InputField label="Project Title" value={proj.title} onChange={(v) => updateProject(proj.id, "title", v)} placeholder="e.g. AI Resume Optimizer" />
            <InputField label="Project Link" value={proj.link} onChange={(v) => updateProject(proj.id, "link", v)} placeholder="e.g. github.com/your-project" />
            <InputField label="Tech Stack (comma-separated)" value={proj.techStack.join(", ")} onChange={(v) => updateProject(proj.id, "techStack", v.split(",").map(s => s.trim()))} />
            <TextAreaField label="Description" value={proj.description} onChange={(v) => updateProject(proj.id, "description", v)} rows={3} />
          </div>
        </div>
      ))}
      <button onClick={addProject} className="w-full bg-black/30 hover:bg-black/50 text-orange-400 font-medium rounded-lg p-3 flex justify-center items-center gap-2 border border-white/10 transition-colors">
        <Plus className="h-4 w-4" /> Add New Project
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ResumeBuilder: React.FC = () => {
  const [template, setTemplate] = useState<string>("modern");
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [skillInput, setSkillInput] = useState<string>("");
  const [languageInput, setLanguageInput] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("personal");

  // Generic update helper for string fields
  const updateResumeField = (field: keyof Omit<ResumeData, 'experience' | 'education' | 'projects' | 'certifications' | 'skills' | 'languages'>, value: string) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = (field: 'skills' | 'languages', input: string, setInput: Dispatch<SetStateAction<string>>) => {
    if (input.trim() && !(resume[field] as string[]).includes(input.trim())) {
      setResume((prev) => ({ ...prev, [field]: [...(prev[field] as string[]), input.trim()] }));
      setInput("");
    }
  };

  const removeItem = (field: 'skills' | 'languages', index: number) => {
    setResume((prev) => ({ ...prev, [field]: (prev[field] as string[]).filter((_, i) => i !== index) }));
  };

  const addBlock = (field: 'experience' | 'education' | 'projects' | 'certifications', newBlock: any) => {
    setResume((prev) => ({ ...prev, [field]: [...(prev[field] as any[]), { ...newBlock, id: Date.now().toString() }] }));
  };

  const updateBlock = (field: 'experience' | 'education' | 'projects' | 'certifications', id: string, subField: string, value: any) => {
    setResume((prev) => ({ ...prev, [field]: (prev[field] as any[]).map((item) => item.id === id ? { ...item, [subField]: value } : item) }));
  };

  const removeBlock = (field: 'experience' | 'education' | 'projects' | 'certifications', id: string) => {
    setResume((prev) => ({ ...prev, [field]: (prev[field] as any[]).filter((item) => item.id !== id) }));
  };

  const generateWithAI = () => setResume(mockAIGeneratedData);

  const { name, email, phone, location, jobTitle, summary, skills, experience, education, projects, certifications, languages } = resume;

  // Render active section
  const renderActiveSection = (): React.ReactElement | null => {
    switch (activeSection) {
      case "personal":
        return (
          <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl shadow-orange-400/20">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-orange-400 text-lg font-semibold">Personal Information & Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Full Name" value={name} onChange={(v) => updateResumeField("name", v)} />
                <InputField label="Job Title" value={jobTitle} onChange={(v) => updateResumeField("jobTitle", v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Email" value={email} onChange={(v) => updateResumeField("email", v)} type="email" />
                <InputField label="Phone" value={phone} onChange={(v) => updateResumeField("phone", v)} />
              </div>
              <InputField label="Location" value={location} onChange={(v) => updateResumeField("location", v)} />
              <TextAreaField label="Professional Summary" value={summary} onChange={(v) => updateResumeField("summary", v)} rows={3} />
            </div>
          </div>
        );
      case "skills":
        return <SkillInputSection label="Key Skills" items={skills} input={skillInput} setInput={setSkillInput} addItem={() => addItem("skills", skillInput, setSkillInput)} removeItem={(i) => removeItem("skills", i)} />;
      case "experience":
        return <ExperienceSection experience={experience} updateExperience={(id, f, v) => updateBlock("experience", id, f, v)} removeExperience={(id) => removeBlock("experience", id)} addExperience={() => addBlock("experience", { role: "", company: "", duration: "", description: "" })} />;
      case "education":
        return <EducationSection education={education} updateEducation={(id, f, v) => updateBlock("education", id, f, v)} removeEducation={(id) => removeBlock("education", id)} addEducation={() => addBlock("education", { degree: "", institution: "", year: "", gpa: "" })} />;
      case "projects":
        return <ProjectsSection projects={projects} setProjects={(newProjects) => setResume((prev) => ({ ...prev, projects: newProjects as Project[], }))} />;
      case "additional":
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl shadow-orange-400/20">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-orange-400 text-lg font-semibold">Certifications</h3>
              </div>
              <div className="p-4 space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex gap-3 items-start border-b border-gray-700 pb-3">
                    <div className="flex-1 space-y-2">
                      <InputField label="Title" value={cert.title} onChange={(v) => updateBlock("certifications", cert.id, "title", v)} placeholder="e.g. Google Cloud Certified" />
                      <div className="grid grid-cols-2 gap-2">
                        <InputField label="Issuer" value={cert.issuer} onChange={(v) => updateBlock("certifications", cert.id, "issuer", v)} placeholder="e.g. Coursera" />
                        <InputField label="Date" value={cert.date} onChange={(v) => updateBlock("certifications", cert.id, "date", v)} placeholder="e.g. May 2024" />
                      </div>
                    </div>
                    <button onClick={() => removeBlock("certifications", cert.id)} className="text-red-400 p-2 bg-transparent hover:bg-white/10 rounded-lg mt-7">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addBlock("certifications", { title: "", issuer: "", date: "" })} className="w-full bg-black/30 hover:bg-black/50 text-orange-400 font-medium rounded-lg p-3 flex justify-center items-center gap-2 border border-white/10 transition-colors mt-2">
                  <Plus className="h-4 w-4" /> Add Certification
                </button>
              </div>
            </div>

            <SkillInputSection label="Languages" items={languages} input={languageInput} setInput={setLanguageInput} addItem={() => addItem("languages", languageInput, setLanguageInput)} removeItem={(i) => removeItem("languages", i)} />
          </div>
        );
      default:
        return null;
    }
  };

  const ResumePreview: React.FC = () => (
    <div className={`bg-black/30 rounded-xl p-6 min-h-96 text-sm space-y-5 shadow-inner border-t-4 border-orange-500`}>
      {name && (
        <div className="text-center pb-3 border-b border-white/10">
          <h2 className="text-3xl font-extrabold text-orange-400 tracking-wider uppercase">{name}</h2>
          {jobTitle && <p className="text-lg font-medium text-gray-300 mt-1">{jobTitle}</p>}
          {(email || phone || location) && (
            <div className="text-gray-400 text-xs flex justify-center gap-4 mt-2">
              {email && <span>📧 {email}</span>}
              {phone && <span>📞 {phone}</span>}
              {location && <span>📍 {location}</span>}
            </div>
          )}
        </div>
      )}

      {summary && (
        <div className="space-y-2">
          <h3 className="font-bold text-orange-400 text-sm border-b border-white/10 pb-1">SUMMARY</h3>
          <p className="text-gray-300 text-xs leading-relaxed">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-orange-400 text-sm border-b border-white/10 pb-1">KEY SKILLS</h3>
          <p className="text-gray-300 text-xs">{skills.join(" • ")}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-orange-400 text-sm border-b border-white/10 pb-1">PROFESSIONAL EXPERIENCE</h3>
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <p className="text-gray-200">{exp.role} at {exp.company}</p>
                <p className="text-gray-400">{exp.duration}</p>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-orange-400 text-sm border-b border-white/10 pb-1">PROJECTS</h3>
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs space-y-1">
              <p className="font-semibold text-gray-200">{proj.title} <span className="text-gray-500">({proj.techStack.join(', ')})</span></p>
              <p className="text-gray-400 italic">Link: {proj.link}</p>
              <p className="text-gray-300 whitespace-pre-wrap">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-orange-400 text-sm border-b border-white/10 pb-1">EDUCATION</h3>
          {education.map((edu) => (
            <div key={edu.id} className="text-xs flex justify-between">
              <div className="font-semibold">
                <p className="text-gray-200">{edu.degree}</p>
                <p className="text-gray-400">{edu.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">{edu.year}</p>
                {edu.gpa && <p className="text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {(certifications.length > 0 || languages.length > 0) && (
        <div className="space-y-3">
          <h3 className="font-bold text-orange-400 text-sm border-b border-white/10 pb-1">ADDITIONAL</h3>
          {certifications.length > 0 && (
            <div className="text-xs">
              <p className="font-semibold text-gray-300">Certifications:</p>
              <ul className="list-disc ml-4 text-gray-400">
                {certifications.map(cert => <li key={cert.id}>{cert.title} ({cert.issuer}, {cert.date})</li>)}
              </ul>
            </div>
          )}
          {languages.length > 0 && (
            <div className="text-xs">
              <p className="font-semibold text-gray-300">Languages:</p>
              <p className="text-gray-400">{languages.join(" • ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative text-white bg-black">
      {/* Background Effect Overlay (Mimicking About Page Style) */}
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/10 before:to-yellow-400/10 before:animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-black/40 border border-white/10 shadow-xl shadow-orange-400/20">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 text-transparent bg-clip-text mb-2">Resume Builder 🚀</h1>
            <p className="text-gray-400">Create your <strong>professional resume</strong> with <strong>AI assistance</strong></p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPreview(!preview)} className={`gap-2 flex items-center justify-center p-3 rounded-lg font-medium transition-colors ${!preview ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600" : "border border-white/10 bg-black/30 text-gray-300 hover:bg-black/50"}`}>
              {!preview ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />} {!preview ? "Preview" : "Edit"}
            </button>

            <button onClick={generateWithAI} className="gap-2 flex items-center justify-center p-3 rounded-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/30 transition-all">
              <Wand2 className="h-4 w-4 animate-pulse" /> Generate with AI
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/10 shadow-inner">
          <label className="block text-sm font-semibold text-orange-400 mb-3">Choose Template</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setTemplate(t.id)} className={`p-3 rounded-lg border-2 transition-all text-center ${template === t.id ? `border-orange-500 bg-gradient-to-br from-black/50 to-black/30 shadow-orange-500/50 shadow-md` : "border-white/10 hover:border-orange-500/50 bg-black/20"}`}>
                <div className={`h-10 bg-gradient-to-r ${t.color} rounded mb-2 w-full mx-auto`} />
                <p className="text-xs font-medium text-gray-300">{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {!preview && (
            <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-1 overflow-x-auto pb-2 border-b-2 border-white/10">
                {SECTIONS.map((section) => (
                  <button key={section.id} onClick={() => setActiveSection(section.id)} className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${activeSection === section.id ? "text-orange-400 border-b-2 border-orange-400 bg-black/40" : "text-gray-400 hover:text-gray-300 hover:bg-black/20"}`}>
                    {section.label}
                  </button>
                ))}
              </div>
              {renderActiveSection()}
            </div>
          )}

          {/* Preview Column */}
          <div className={`${preview ? "lg:col-span-3" : "lg:col-span-1"}`}>
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 sticky top-4 shadow-xl shadow-orange-400/20">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-orange-400">
                  <FileText className="h-5 w-5" />
                  <h4 className="font-semibold">Live Resume Preview</h4>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <ResumePreview />

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button className="flex-1 gap-2 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-colors text-black font-semibold p-3 rounded-lg">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button className="flex-1 gap-2 flex items-center justify-center border border-white/10 hover:bg-black/50 bg-black/30 text-gray-300 font-semibold p-3 rounded-lg">
                    <Save className="h-4 w-4" /> Save Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;