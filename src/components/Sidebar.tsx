import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Brain,
  FlaskConical,
  Folder,
  User,
} from "lucide-react";
import { AccountToggle } from "./AccountToggle";
import { Plan } from "./Plan";
// Import the logo image
import logo from "../assets/logo.png"; 

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const sidebarItems = [
  { title: "Dashboard", icon: Home, path: "/dashboard" },
  { title: "Resume Builder", icon: FileText, path: "/dashboard/resume-builder" },
  { title: "AI Interviews", icon: FlaskConical, path: "/dashboard/ai-interviews" },
  { title: "Career Advisor", icon: Brain, path: "/dashboard/career-advisor" },
  
  { title: "Job Tracker", icon: Folder, path: "/dashboard/job-tracker" },
  { title: "Profile", icon: User, path: "/dashboard/profile" },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 bg-[#121212] border-r border-orange-500/10 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg shadow-orange-300/10 flex flex-col`}
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

      {/* Sidebar Content (Scrollable) */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col">
        
        {/* Logo Section with text */}
        <div className="flex items-center p-2 mb-4">
            <img 
                src={logo} 
                alt="CareerGenie.AI Genie Icon" 
                className="h-8 w-8 object-contain shrink-0 mr-1" // Smaller image on the left
            />
            <span className="text-2xl font-semibold tracking-tighter text-white truncate">
    CareerGenie.AI
</span>
        </div>
        
        {/* Account Toggle Section (Placed above main nav) */}
        <AccountToggle />
        
        {/* Sidebar Nav Items */}
        <div className="space-y-2 mt-2 flex-grow">
          {sidebarItems.map(({ title, icon: Icon, path }) => {
            const isDashboard = path === "/dashboard";
            const isExactMatch = location.pathname === path;
            const isSubPathMatch = !isDashboard && location.pathname.startsWith(path + "/");
            
            const isActive = isExactMatch || isSubPathMatch;

            return (
              <NavLink
                to={path}
                key={path}
                className={`flex items-center gap-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 shadow-sm
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-400 text-black shadow-lg shadow-orange-500/30"
                      : "text-stone-300 hover:bg-orange-500/10 hover:text-white"
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Plan toggle at bottom */}
      <div className="p-4 border-t border-orange-500/10 flex-shrink-0">
        <Plan />
      </div>
    </aside>
  );
};

export default Sidebar;