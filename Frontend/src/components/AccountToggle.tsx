import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import useAuthStore from "../store/auth";

const MyToggleIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? (
    <ChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
  ) : (
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
  );
};

export const AccountToggle = () => {
  const { user, logout } = useAuthStore(); // Get user and logout from Zustand store
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();             // Clear Zustand store
    localStorage.clear(); // Optional: Clear localStorage if needed
    navigate("/");        // Redirect to homepage
  };

  return (
    <div className="border-b border-orange-500/10 mb-4 mt-4">
      <button
        onClick={handleToggle}
        className="flex px-2 py-2 hover:bg-orange-400/10 rounded-md relative gap-3 w-full items-center transition-colors"
      >
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.name || "avatar"}`}
          alt="avatar"
          className="size-8 rounded-full shrink-0 bg-orange-500 shadow-md"
        />
        <div className="text-start">
          <span className="text-sm font-semibold text-white block">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-orange-300 block">
            {user?.email || "user@example.com"}
          </span>
        </div>
        <MyToggleIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="mt-2 ml-2 text-sm bg-[#0a0a0a] border border-orange-500/10 rounded-md shadow-md py-2">
          <button className="block w-full text-left px-4 py-1.5 text-orange-300 hover:bg-orange-500/10 transition">
            Account Settings
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-1.5 text-orange-300 hover:bg-orange-500/10 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
