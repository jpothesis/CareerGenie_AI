import React, { useState } from "react";

type Project = {
  title: string;
  description: string;
};

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export const ProjectForm: React.FC<Props> = ({ projects, setProjects }) => {
  const [form, setForm] = useState<Project>({
    title: "",
    description: "",
  });

  const add = () => {
    if (form.title && form.description) {
      setProjects([...projects, form]);
      setForm({ title: "", description: "" });
    }
  };

  return (
    <div>
      <label className="font-semibold block mb-1">Projects</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
        />
      </div>
      <button onClick={add} className="btn mt-2">Add</button>

      <div className="flex flex-wrap gap-2 mt-3">
        {projects.map((p, i) => (
          <span
            key={i}
            className="bg-yellow-900/60 text-yellow-300 px-3 py-1 rounded-full text-sm"
          >
            {p.title}: {p.description}
          </span>
        ))}
      </div>
    </div>
  );
};
