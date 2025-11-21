"use client";
import React, { useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import html2pdf from "html2pdf.js";

// 1. Import the real API function and necessary icons
import { fetchAIGeneratedData } from "../../api/resumeService"; // <<< CHECK THIS PATH >>>
import { Loader2, AlertTriangle } from "lucide-react";

// 2. IMPORT TYPES from src/resume.ts
import type {
  ResumeData,
  Experience,
  Education,
  Project,
  Certification,
} from "../../components/resume";

// 3. IMPORT STYLED TEMPLATES from src/components/ResumeTemplates
import TemplateModern from "../../components/ResumeTemplates/TemplateModern";
import TemplateProfessional from "../../components/ResumeTemplates/TemplateClassic";
import TemplateCreative from "../../components/ResumeTemplates/TemplateCreative";
import TemplateMinimal from "../../components/ResumeTemplates/TemplateClean";

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

// --- TEMPLATE COMPONENTS MAP ---
const TEMPLATE_COMPONENTS = {
  modern: TemplateModern,
  professional: TemplateProfessional,
  creative: TemplateCreative,
  minimal: TemplateMinimal,
};

// Template Renderer Component (Unchanged)
interface TemplateRendererProps {
  templateId: string;
  data: ResumeData;
  ref: React.Ref<HTMLDivElement>;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = React.forwardRef(({
  templateId,
  data,
}, ref) => {
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId as keyof typeof TEMPLATE_COMPONENTS];
  if (!TemplateComponent) {
    return (
      <div ref={ref} className="bg-white p-6 text-red-500">
        Template not found.
      </div>
    );
  }
  return (
    <div ref={ref}>
      <TemplateComponent data={data} />
    </div>
  );
});
TemplateRenderer.displayName = 'TemplateRenderer';


// --- INITIAL DATA & CONSTANTS (Unchanged) ---
const INITIAL_RESUME_DATA: ResumeData = { name: "", email: "", phone: "", location: "", jobTitle: "", summary: "", skills: [], experience: [], education: [], projects: [], certifications: [], languages: [], };

const TEMPLATES = [
  { id: "modern", name: "Modern ", color: "from-orange-500 to-amber-500" },
  { id: "professional", name: "Classic ", color: "from-gray-500 to-slate-500" },
  { id: "creative", name: "Creative ", color: "from-purple-500 to-pink-500" },
  { id: "minimal", name: "Clean ", color: "from-green-500 to-teal-500" },
];

const SECTIONS = [
  { id: "personal", label: "Personal & Summary" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "additional", label: "Certifications & Languages" },
];

// --- MOCK DATA REMOVED ---
// The mockAIGeneratedData constant is now removed and replaced by the API call.


// --- SMALL REUSABLE FIELDS (Unchanged) ---
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

// Skill input section (Unchanged)
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

// Experience section (Unchanged)
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

// Education Section (Unchanged)
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

// Projects Section (Unchanged)
interface ProjectsSectionProps { projects: Project[]; updateProject: (id: string, field: keyof Project, value: any) => void; removeProject: (id: string) => void; addProject: () => void; }
const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, updateProject, removeProject, addProject }) => {
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
  
  // New state for API integration
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to target the template component for PDF conversion
  const resumeRef = useRef<HTMLDivElement>(null);

  // Generic update helper for string fields (Unchanged)
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

  // Generic add/update/remove for block-level sections (Unchanged)
  const addBlock = (field: 'experience' | 'education' | 'projects' | 'certifications', newBlock: Partial<Experience | Education | Project | Certification>) => {
    setResume((prev) => ({ ...prev, [field]: [...(prev[field] as any[]), { ...newBlock, id: Date.now().toString() }] }));
  };

  const updateBlock = (field: 'experience' | 'education' | 'projects' | 'certifications', id: string, subField: string, value: any) => {
    setResume((prev) => ({ ...prev, [field]: (prev[field] as any[]).map((item) => item.id === id ? { ...item, [subField]: value } : item) }));
  };

  const removeBlock = (field: 'experience' | 'education' | 'projects' | 'certifications', id: string) => {
    setResume((prev) => ({ ...prev, [field]: (prev[field] as any[]).filter((item) => item.id !== id) }));
  };

  // --- UPDATED AI GENERATION LOGIC ---
// Inside ResumeBuilder.tsx -> generateWithAI function
const generateWithAI = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // 🔥 send full resume data to backend
    const generatedData = await fetchAIGeneratedData(resume);

    // Additional safety check
    if (!generatedData || typeof generatedData !== "object") {
      throw new Error("AI returned invalid formatted data.");
    }

    if (!generatedData.name) {
      console.warn("AI Missing name field: ", generatedData);
    }

    // 🔥 Update UI safely
    setResume((prev) => ({
      ...prev,
      ...generatedData,
    }));
  } catch (err: any) {
    setError(err.message || "Failed to generate resume.");
  } finally {
    setIsLoading(false);
  }
};

  // --- PDF DOWNLOAD LOGIC (Unchanged) ---
  const handleDownload = () => {
    if (resumeRef.current) {
      const filename = `${resume.name.replace(/\s/g, "_") || "User"}_Resume_${template}.pdf`;
      const element = resumeRef.current;

      // html2pdf configuration
      const opt = {
          margin: 0.5,
          filename: filename,
          image: {
              type: 'jpeg' as const, 
              quality: 0.98
          },
          html2canvas: {
              scale: 2,
              logging: true,
              dpi: 192,
              letterRendering: true
          },
          jsPDF: {
              unit: 'in',
              format: 'letter' as const,
              orientation: 'portrait' as const
          }
      };

      html2pdf().from(element).set(opt).save();
    }
  };

  const { name, email, phone, location, jobTitle, summary, skills, experience, education, projects, certifications, languages } = resume;

  // Render active section (Unchanged)
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
        return <ExperienceSection experience={experience} updateExperience={(id, f, v) => updateBlock("experience", id, f, v)} removeExperience={(id) => removeBlock("experience", id)} addExperience={() => addBlock("experience", { role: "", company: "", duration: "", description: "" } as Experience)} />;
      case "education":
        return <EducationSection education={education} updateEducation={(id, f, v) => updateBlock("education", id, f, v)} removeEducation={(id) => removeBlock("education", id)} addEducation={() => addBlock("education", { degree: "", institution: "", year: "", gpa: "" } as Education)} />;
      case "projects":
        return (
          <ProjectsSection
            projects={projects}
            updateProject={(id, f, v) => updateBlock("projects", id, f as string, v)}
            removeProject={(id) => removeBlock("projects", id)}
            addProject={() =>
              addBlock("projects", {
                id: crypto.randomUUID(), // Generates a unique ID
                title: "",
                description: "",
                techStack: [],
                link: "",
              })
            }
          />
        );
      case "additional":
        return (
          <div className="space-y-6">
            {/* Certifications Block */}
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl shadow-orange-400/20">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-orange-400 text-lg font-semibold">Certifications</h3>
              </div>
              <div className="p-4 space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex gap-3 items-start border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
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
                <button onClick={() => addBlock("certifications", { title: "", issuer: "", date: "" } as Certification)} className="w-full bg-black/30 hover:bg-black/50 text-orange-400 font-medium rounded-lg p-3 flex justify-center items-center gap-2 border border-white/10 transition-colors mt-2">
                  <Plus className="h-4 w-4" /> Add Certification
                </button>
              </div>
            </div>

            {/* Languages Block */}
            <SkillInputSection label="Languages" items={languages} input={languageInput} setInput={setLanguageInput} addItem={() => addItem("languages", languageInput, setLanguageInput)} removeItem={(i) => removeItem("languages", i)} />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen relative text-white bg-black">
      {/* Background Effect Overlay (Mimicking About Page Style) */}
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/10 before:to-yellow-400/10 before:animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-black/40 border border-white/10 shadow-xl shadow-orange-400/20">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 text-transparent bg-clip-text mb-2">Resume Builder </h1>
            <p className="text-gray-400">Create your <strong>professional resume</strong> with <strong>AI assistance</strong></p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPreview(!preview)} className={`gap-2 flex items-center justify-center p-3 rounded-lg font-medium transition-colors ${!preview ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600" : "border border-white/10 bg-black/30 text-gray-300 hover:bg-black/50"}`}>
              {!preview ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />} {!preview ? "Preview" : "Edit"}
            </button>

            {/* UPDATED: Loading/Disable state for AI Button */}
            <button 
              onClick={generateWithAI} 
              disabled={isLoading} 
              className={`gap-2 flex items-center justify-center p-3 rounded-lg font-bold transition-all ${isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/30"}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Generate with AI
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* New: Error Message Display */}
        {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-800/50 border border-red-500 text-red-300 rounded-lg shadow-xl">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}

        {/* Template Selection (Unchanged) */}
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
            // **IMPROVED:** Added 'h-[calc(100vh-200px)] overflow-y-auto' for better alignment with sticky preview.
            <div className="lg:col-span-2 space-y-6 h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div className="flex gap-1 overflow-x-auto pb-2 border-b-2 border-white/10 sticky top-0 bg-black/80 z-20 pt-1">
                {SECTIONS.map((section) => (
                  <button key={section.id} onClick={() => setActiveSection(section.id)} className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${activeSection === section.id ? "text-orange-400 border-b-2 border-orange-400 bg-black/40" : "text-gray-400 hover:text-gray-300 hover:bg-black/20"}`}>
                    {section.label}
                  </button>
                ))}
              </div>
              {/* Content area is now inside the scrolling container */}
              <div className="space-y-6">
                  {renderActiveSection()}
              </div>
            </div>
          )}

          {/* Preview Column (Unchanged) */}
          <div className={`${preview ? "lg:col-span-3" : "lg:col-span-1"}`}>
            {/* The sticky behavior will now align better with the scrollable input panel */}
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 sticky top-4 shadow-xl shadow-orange-400/20">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-orange-400">
                  <FileText className="h-5 w-5" />
                  <h4 className="font-semibold">Live Resume Preview ({template.charAt(0).toUpperCase() + template.slice(1)} Template)</h4>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* DYNAMIC TEMPLATE RENDERER */}
                <TemplateRenderer
                  templateId={template}
                  data={resume}
                  ref={resumeRef} // Attach the ref here
                />

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button onClick={handleDownload} className="flex-1 gap-2 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-colors text-black font-semibold p-3 rounded-lg">
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