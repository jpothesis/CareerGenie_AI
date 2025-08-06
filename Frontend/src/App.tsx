import { useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/auth";

// Lazy-loaded pages
const Hero = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Features = lazy(() => import("./pages/Features"));
const Resources = lazy(() => import("./pages/Resources"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./layouts/Dashboard"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout.tsx"));

const ResumeBuilder = lazy(() => import("./pages/Dashboard/ResumeBuilder"));
const CareerAdvisor = lazy(() => import("./pages/Dashboard/CareerAdvisor")); // ✅ Added

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Hero /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/features" element={<><Navbar /><Features /></>} />
        <Route path="/resources" element={<><Navbar /><Resources /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />

        {/* Protected Routes with Sidebar + TopBar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="career-advisor" element={<CareerAdvisor />} /> {/* ✅ Added */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
