import { useState } from "react";
import { Outlet } from "react-router-dom";

// Components
import Sidebar from "../components/Sidebar";
import TopBar from "../pages/Dashboard/TopBar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with sidebar toggle */}
        <TopBar setSidebarOpen={setSidebarOpen} />

        {/* Nested route content */}
        {/* ⭐ ADDED ID HERE TO TARGET FOR SCROLLING ⭐ */}
        <main id="dashboard-scroll-area" className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;