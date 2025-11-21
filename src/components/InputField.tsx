import React, { type InputHTMLAttributes } from "react";
import type { IconType } from "react-icons";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: IconType; // ✅ added icon support
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "placeholder"
>;

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete = "on",
  icon: Icon, // ✅ receive icon
  ...rest
}) => {
  return (
    <div className="w-full mb-6">
      <label className="block mb-2 font-medium text-white text-sm md:text-base flex items-center">
        {Icon && <Icon className="text-orange-400 mr-2" />} {/* ✅ Icon shown */}
        {label}
      </label>

      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
        className="w-full px-4 py-2 rounded-md bg-[#1a1a2e] text-white placeholder:text-gray-400 border-2 border-transparent 
        focus:border-yellow-400 focus:outline-none focus:ring-2 
        focus:ring-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)]
        transition duration-200"
      />
    </div>
  );
};

export default InputField;
