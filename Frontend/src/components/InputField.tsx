// src/components/InputField.tsx

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  autoComplete = "on",
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <input
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md bg-[#1a1a2e] text-white placeholder-gray-400 border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.5)] transition duration-200"
      />
    </div>
  );
};

export default InputField;
