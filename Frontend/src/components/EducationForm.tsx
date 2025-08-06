import { useState } from "react";
import { Button } from "./ui/button";

type Education = {
  degree: string;
  institution: string;
  year: string;
};

type Props = {
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
};

const inputStyle =
  "bg-[#1a1a2e] text-white px-4 py-2 rounded-md border-2 border-transparent " +
  "focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 " +
  "focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200 w-full";

export const EducationForm = ({ education, setEducation }: Props) => {
  const [form, setForm] = useState<Education>({
    degree: "",
    institution: "",
    year: "",
  });

  const handleAddEducation = () => {
    if (form.degree && form.institution && form.year) {
      setEducation([...education, form]);
      setForm({ degree: "", institution: "", year: "" });
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <h2 className="text-white font-semibold text-lg">Education</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Degree"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
          className={inputStyle}
        />
        <input
          type="text"
          placeholder="Institution"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          className={inputStyle}
        />
        <input
          type="text"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          className={inputStyle}
        />
      </div>
      <Button
        onClick={handleAddEducation}
        className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white mt-2"
      >
        + Add
      </Button>
    </div>
  );
};
