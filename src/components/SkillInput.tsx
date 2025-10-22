import { useState } from "react";
import { Button } from "./ui/button";

type SkillInputProps = {
  skills: string[];
  setSkills: (skills: string[]) => void;
};

const inputStyle =
  "flex-1 bg-[#1a1a2e] text-white px-4 py-2 rounded-md border-2 border-transparent " +
  "focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 " +
  "focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200";

const SkillInput: React.FC<SkillInputProps> = ({ skills, setSkills }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setInput("");
    }
  };

  const removeSkill = (index: number) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-lg mb-2">Skills</h2>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. React, Python"
          className={inputStyle}
        />
        <Button
          onClick={addSkill}
          className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-semibold hover:opacity-90 transition"
        >
          + Add
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-yellow-900/60 text-yellow-300 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(i)}
                className="ml-1 text-yellow-200 hover:text-white font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillInput;
