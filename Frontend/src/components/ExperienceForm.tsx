import React, { useState } from "react";

type Experience = {
  role: string;
  company: string;
  duration: string;
};

interface Props {
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
}

export const ExperienceForm: React.FC<Props> = ({ experience, setExperience }) => {
  const [form, setForm] = useState<Experience>({
    role: "",
    company: "",
    duration: "",
  });

  const add = () => {
    if (form.role && form.company && form.duration) {
      setExperience([...experience, form]);
      setForm({ role: "", company: "", duration: "" });
    }
  };

  return (
    <div>
      <label className="font-semibold block mb-1">Experience</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, role: e.target.value })
          }
          className="input"
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, company: e.target.value })
          }
          className="input"
        />
        <input
          placeholder="Duration"
          value={form.duration}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, duration: e.target.value })
          }
          className="input"
        />
      </div>
      <button onClick={add} className="btn mt-2">Add</button>
<div className="flex flex-wrap gap-2 mt-3">
  {experience.map((e, i) => (
    <span
      key={i}
      className="bg-yellow-900/60 text-yellow-300 px-3 py-1 rounded-full text-sm"
    >
      {e.role} @ {e.company} ({e.duration})
    </span>
  ))}
</div>


    </div>
  );
};
