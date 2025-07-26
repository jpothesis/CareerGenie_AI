import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const MyToggleIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? (
    <ChevronUp className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] text-xs w-3 h-3" />
  ) : (
    <ChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%+4px)] text-xs w-3 h-3" />
  );
};

export const AccountToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="border-b mb-4 mt-4 border-stone-300">
      <button
        onClick={handleToggle}
        className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center"
      >
        <img
          src="https://api.dicebear.com/9.x/avataaars/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">Jaanvi</span>
          <span className="text-xs block text-stone-500">jaanvich.dev</span>
        </div>
        {/* Toggle Icon on the right */}
        <MyToggleIcon isOpen={isOpen} />
      </button>

      {/* Optional Dropdown Content */}
      {isOpen && (
        <div className="p-2 text-sm text-stone-600">
          {/* Your dropdown content here */}
          <p>Account Settings</p>
          <p>Logout</p>
        </div>
      )}
    </div>
  );
};
