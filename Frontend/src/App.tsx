import { Dashboard }from "./pages/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar";
import { useState } from "react";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Hamburger Button */}
      <div className="md:hidden p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">CareerGenie.AI</h1>
        <button
          className="text-2xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;