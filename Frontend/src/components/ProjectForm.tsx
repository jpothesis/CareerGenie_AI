import { useState } from "react";
import { Button } from "./ui/button";

type Project = {
  title: string;
  description: string;
};

type Props = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const inputStyle =
  "bg-[#1a1a2e] text-white px-4 py-2 rounded-md border-2 border-transparent " +
  "focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 " +
  "focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200 w-full";

export const ProjectForm = ({ projects, setProjects }: Props) => {
  const [form, setForm] = useState<Project>({
    title: "",
    description: "",
  });

  const handleAddProject = () => {
    if (form.title && form.description) {
      setProjects([...projects, form]);
      setForm({ title: "", description: "" });
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <h2 className="text-white font-semibold text-lg">Projects</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputStyle}
        />
        <input
          type="text"
          placeholder="Project Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputStyle}
        />
      </div>
      <Button
        onClick={handleAddProject}
        className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white mt-2"
      >
        + Add
      </Button>
    </div>
  );
};
