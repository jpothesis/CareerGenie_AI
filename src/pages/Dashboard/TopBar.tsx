import { Calendar, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/auth";
import { getGreeting } from "../../lib/getGreeting";

type TopBarProps = {
  setSidebarOpen?: (open: boolean) => void; // ✅ optional prop
};

const TopBar = ({ setSidebarOpen }: TopBarProps) => {
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState(getGreeting());

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const userName = user?.name || "there";

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-gray-800 bg-[#0a0a0a] rounded-md shadow-md shadow-orange-500/5">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* ✅ Hamburger button for mobile */}
          {setSidebarOpen && (
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          )}
          <div>
            <p className="text-sm font-semibold text-white tracking-wide">
              {greeting}, {userName}!
            </p>
            <p className="text-xs text-gray-400">{today}</p>
          </div>
        </div>

        {/* Right Side */}
        <button className="flex items-center gap-2 text-sm font-medium text-white px-3 py-1.5 rounded-md border border-gray-700 bg-black hover:bg-gradient-to-r hover:from-orange-400 hover:to-yellow-300 hover:text-black transition-all duration-300 shadow-sm shadow-orange-500/10">
          <Calendar className="w-4 h-4" />
          <span>Last 6 Months</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
