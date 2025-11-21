import React, { type InputHTMLAttributes } from 'react';
import { type IconType } from 'react-icons'; // Import IconType for the prop definition

// 1. Extend InputHTMLAttributes
// 2. Add the new 'icon' prop
type InputFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  // FIX: Add the optional icon prop
  icon?: IconType; 
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>;


const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  // FIX: Destructure and rename 'icon' to 'Icon' for component rendering
  icon: Icon, 
  type = "text",
  autoComplete = "on",
  // Collect all other standard HTML attributes
  ...rest 
}) => {
  return (
    <div className="w-full mb-6">
      <label className="block mb-2 font-medium text-white text-sm md:text-base">
        {label}
      </label>
      {/* FIX: Wrap input and icon in a div for layout */}
      <div className="flex items-center px-4 py-2 rounded-md bg-[#1a1a2e] border-2 border-transparent focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200">
        
        {/* FIX: Render the icon if provided */}
        {Icon && <Icon className="text-orange-400 text-lg mr-3" />}
        
        <input
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          // Remove background and border classes from here, they are on the wrapper div
          className="w-full bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
          {...rest} 
        />
      </div>
    </div>
  );
};

export default InputField;