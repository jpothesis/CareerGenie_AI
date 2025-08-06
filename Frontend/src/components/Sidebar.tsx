import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Brain,
  LineChart,
  GraduationCap,
  FlaskConical,
  Folder,
  User,
} from "lucide-react";
import { AccountToggle } from "./AccountToggle";
import SearchInput from "./SearchInput";
import { Plan } from "./Plan";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const sidebarItems = [
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  { title: "Resume Builder", icon: FileText, path: "/dashboard/resume-builder" },
  { title: "Career Advisor", icon: Brain, path: "/dashboard/career-advisor" },
  { title: "Insights", icon: LineChart, path: "/dashboard/insights" },
  { title: "Learn", icon: GraduationCap, path: "/dashboard/learn" },
  { title: "AI Interviews", icon: FlaskConical, path: "/dashboard/ai-interviews" },
  { title: "Job Tracker", icon: Folder, path: "/dashboard/job-tracker" },
  { title: "Profile", icon: User, path: "/dashboard/profile" },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 bg-[#121212] border-r border-orange-500/10 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg shadow-orange-300/10`}
    >
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={() => setIsOpen(false)}
          className="text-xl text-orange-400 hover:text-orange-300 transition"
        >
          ✕
        </button>
      </div>

      {/* Scrollable sidebar area */}
      <div className="overflow-y-auto sticky top-4 h-[calc(100vh-32px-48px)] p-4 space-y-4">
        <AccountToggle />
        <SearchInput />

        {/* Sidebar nav items */}
        <div className="space-y-1">
          {sidebarItems.map(({ title, icon: Icon, path }) => {
            const isExactMatch =
              location.pathname === path || location.pathname.startsWith(path + "/");

            return (
              <NavLink
                to={path}
                key={path}
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isExactMatch
                    ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black shadow-md"
                    : "text-stone-400 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-400 hover:text-black hover:shadow-md"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Plan toggle at bottom */}
      <div className="p-4 border-t border-orange-500/10">
        <Plan />
      </div>
    </aside>
  );
};

export default Sidebar;
