import React, { type InputHTMLAttributes } from 'react';

// 1. Extend InputHTMLAttributes to include all standard <input> props (like min, max, name, type, etc.)
// 2. Use Omit to prevent conflicts for props we redefine explicitly (like 'value', 'onChange', 'placeholder').
type InputFieldProps = {
  label: string;
  // Redefine value and onChange explicitly for stronger typing
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>;


const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  // Destructure props we want to handle specifically or provide defaults for
  type = "text",
  autoComplete = "on",
  // Collect all other standard HTML attributes (like name, required, min, max, etc.)
  ...rest 
}) => {
  return (
    <div className="w-full mb-6">
      <label className="block mb-2 font-medium text-white text-sm md:text-base">
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Spread all remaining attributes (including 'min', 'max', and 'name') to the native element
        {...rest} 
        className="w-full px-4 py-2 rounded-md bg-[#1a1a2e] text-white placeholder:text-gray-400 border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200"
      />
    </div>
  );
};

export default InputField;