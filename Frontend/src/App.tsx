import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Hero from "./pages/Home";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Header";
import useAuthStore from "./store/auth";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  // Load auth state (user & token) from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        {/* Protected Dashboard Route without Navbar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row h-screen">
                {/* Mobile Header */}
                <div className="md:hidden p-4 flex justify-between items-center shadow">
                  <h1 className="text-xl font-bold">CareerGenie.AI</h1>
                  <button
                    className="text-2xl"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    ☰
                  </button>
                </div>

                {/* Sidebar visible after login */}
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                {/* Dashboard Content */}
                <main className="flex-1 overflow-auto p-4">
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;