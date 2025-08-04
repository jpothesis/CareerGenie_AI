import React, { useState } from "react";

type Education = {
  degree: string;
  institution: string;
  year: string;
};

interface Props {
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
}

export const EducationForm: React.FC<Props> = ({ education, setEducation }) => {
  const [form, setForm] = useState<Education>({
    degree: "",
    institution: "",
    year: "",
  });

  const add = () => {
    if (form.degree && form.institution && form.year) {
      setEducation([...education, form]);
      setForm({ degree: "", institution: "", year: "" });
    }
  };

  return (
    <div>
      <label className="font-semibold block mb-1">Education</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          placeholder="Degree"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
          className="input"
        />
        <input
          placeholder="Institution"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          className="input"
        />
        <input
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          className="input"
        />
      </div>
      <button onClick={add} className="btn mt-2">Add</button>

      <div className="flex flex-wrap gap-2 mt-3">
        {education.map((ed, i) => (
          <span
            key={i}
            className="bg-yellow-900/60 text-yellow-300 px-3 py-1 rounded-full text-sm"
          >
            {ed.degree}, {ed.institution} ({ed.year})
          </span>
        ))}
      </div>
    </div>
  );
};
