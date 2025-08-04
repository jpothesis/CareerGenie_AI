import { useState } from "react";
import { Button } from "./ui/button";

type SkillInputProps = {
  skills: string[];
  setSkills: (skills: string[]) => void;
};

const SkillInput: React.FC<SkillInputProps> = ({ skills, setSkills }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      setSkills([...skills, input.trim()]);
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
      <label className="block mb-2 font-medium text-white">Skills</label>
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. React, Python"
          className="flex-1 bg-[#1a1a2e] text-white px-4 py-2 rounded-md border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200"
        />
        <Button
          onClick={addSkill}
          className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-semibold hover:opacity-90 transition"
        >
          Add
        </Button>
      </div>

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
    </div>
  );
};

export default SkillInput;
