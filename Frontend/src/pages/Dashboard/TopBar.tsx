import { Calendar } from "lucide-react";
import useAuthStore from "../../store/auth"; // adjust the path as needed

const TopBar = () => {
  const { user } = useAuthStore();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const userName = user?.name || "there";

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-gray-800 bg-[#0a0a0a] rounded-md shadow-md shadow-orange-500/5">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div>
          <p className="text-sm font-semibold text-white tracking-wide">
            ✨ Good morning, {userName}!
          </p>
          <p className="text-xs text-gray-400">{today}</p>
        </div>

        {/* Right Button */}
        <button className="flex items-center gap-2 text-sm font-medium text-white px-3 py-1.5 rounded-md border border-gray-700 bg-black hover:bg-gradient-to-r hover:from-orange-400 hover:to-yellow-300 hover:text-black transition-all duration-300 shadow-sm shadow-orange-500/10">
          <Calendar className="w-4 h-4" />
          <span>Last 6 Months</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
