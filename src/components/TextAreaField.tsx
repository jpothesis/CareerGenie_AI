// src/components/TextAreaField.tsx

import React from "react";

type TextAreaFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  required?: boolean;
  rows?: number; // ✅ Add this line
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  required,
  rows = 5, // ✅ Set a default value
}) => {
  return (
    <div className="w-full mb-6">
      <label className="block mb-2 font-medium text-white text-sm md:text-base">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2 rounded-md bg-[#1a1a2e] text-white placeholder:text-gray-400 border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200 resize-none"
      ></textarea>
    </div>
  );
};

export default TextAreaField;
