import { useState, useRef } from "react";
import { Button } from "./ui/button";

type Experience = {
  role: string;
  company: string;
  duration: string;
  description: string;
};

type Props = {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
};

export const ExperienceForm = ({ experiences, setExperiences }: Props) => {
  const [form, setForm] = useState<Experience>({
    role: "",
    company: "",
    duration: "",
    description: "",
  });

  const inputStyle =
    "bg-[#1a1a2e] text-white px-4 py-2 rounded-md border-2 border-transparent " +
    "focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 " +
    "focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200 w-full";

  const textareaStyle =
    "bg-[#1a1a2e] text-white px-4 py-2 rounded-md border-2 border-transparent " +
    "focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 " +
    "focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200 w-full h-24 resize-none";

  const handleAddExperience = () => {
    if (form.role && form.company && form.duration && form.description) {
      setExperiences([...experiences, form]);
      setForm({ role: "", company: "", duration: "", description: "" });
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <h2 className="text-white font-semibold text-lg">💼 Experience</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className={inputStyle}
        />
        <input
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className={inputStyle}
        />
        <input
          type="text"
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className={inputStyle}
        />
      </div>
      <textarea
        placeholder="Describe your responsibilities, achievements, etc."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className={textareaStyle}
      />
      <Button
        onClick={handleAddExperience}
        className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white mt-2"
      >
        + Add Experience
      </Button>
    </div>
  );
};
