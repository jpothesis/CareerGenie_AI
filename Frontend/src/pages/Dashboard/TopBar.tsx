import { Calendar } from "lucide-react";
import useAuthStore from "../../store/auth"; // adjust path if needed

export const TopBar = () => {
  const { user } = useAuthStore();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const userName = user?.name || "there"; // fallback if user not set

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div>
          <p className="text-sm font-semibold text-gray-800">
            🚀 Good morning, {userName}!
          </p>
          <p className="text-xs text-stone-500">{today}</p>
        </div>

        {/* Right Button */}
        <button className="flex items-center gap-2 text-sm bg-stone-100 px-3 py-1.5 rounded-md hover:bg-violet-100 hover:text-violet-700 transition-all">
          <Calendar className="w-4 h-4" />
          <span>Last 6 Months</span>
        </button>
      </div>
    </div>
  );
};
