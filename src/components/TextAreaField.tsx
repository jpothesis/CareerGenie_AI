import React from "react";

export interface TextAreaFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean; // ✅ added this line
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  rows = 4,
  required,
  disabled = false, // ✅ default value
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-gray-400"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled} // ✅ now supported
        className={`w-full p-3 bg-black/30 border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
};

export default TextAreaField;
