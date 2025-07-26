// /layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = () => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#0f172a] text-white">
        <Topbar />
        <div className="p-6">
          <Outlet /> {/* This will render nested route pages */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
