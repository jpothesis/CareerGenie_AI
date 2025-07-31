import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/auth";

// ✅ Lazy-loaded pages
const Hero = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Features = lazy(() => import("./pages/Features"));
const Resources = lazy(() => import("./pages/Resources")); // <-- New
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <Routes>
        {/* ✅ Public Routes */}
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
          path="/features"
          element={
            <>
              <Navbar />
              <Features />
            </>
          }
        />
        <Route
          path="/resources" // ✅ Added Resources route
          element={
            <>
              <Navbar />
              <Resources />
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

        {/* ✅ Protected Route */}
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
                    onClick={() => setSidebarOpen((prev) => !prev)}
                  >
                    ☰
                  </button>
                </div>

                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4">
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
