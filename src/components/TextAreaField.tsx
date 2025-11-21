import React, { type TextareaHTMLAttributes } from "react";
import { type IconType } from 'react-icons'; // Import IconType for the prop definition

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Explicitly defining props we want to make sure are present, extending TextareaHTMLAttributes
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  // FIX: Add the optional icon prop
  icon?: IconType;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  rows = 4,
  // FIX: Destructure and rename 'icon' to 'Icon' for component rendering
  icon: Icon,
  disabled = false, 
  ...rest // Collects 'required', 'id', 'className' if needed, and other standard attributes
}) => {
  return (
    <div className="w-full mb-6">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 font-medium text-white text-sm md:text-base"
        >
          {label}
        </label>
      )}
      {/* FIX: Wrap textarea and icon in a div for layout */}
      <div 
        className={`flex p-3 rounded-md bg-[#1a1a2e] border-2 border-transparent focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 focus-within:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* FIX: Render the icon if provided, align top */}
        {Icon && <Icon className="text-orange-400 text-lg mr-3 mt-1" />}

        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled} 
          // Spread remaining attributes (like 'required')
          {...rest} 
          // Removed redundant styles from here, using parent wrapper for background/border
          className="w-full bg-transparent text-white placeholder:text-gray-400 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default TextAreaField;