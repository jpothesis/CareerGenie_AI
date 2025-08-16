// src/components/InputField.tsx

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  type?: string; // ✅ Allow type prop
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  autoComplete = "on",
  required,
  type = "text", // ✅ Default to text
}) => {
  return (
    <div className="w-full mb-6">
      <label className="block mb-2 font-medium text-white text-sm md:text-base">
        {label}
      </label>
      <input
        name={name}
        type={type} // ✅ Pass type to input
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 rounded-md bg-[#1a1a2e] text-white placeholder:text-gray-400 border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200"
      />
    </div>
  );
};

export default InputField;
