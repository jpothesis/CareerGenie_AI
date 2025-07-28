import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Hero from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
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

        {/* Routes */}
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
