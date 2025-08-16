import { useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Store
import useAuthStore from "./store/auth";

// Lazy-loaded pages (all relative paths)
const Hero = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Features = lazy(() => import("./pages/Features"));
const Resources = lazy(() => import("./pages/Resources"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// Dashboard + Layout
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

// Dashboard nested pages
const ResumeBuilder = lazy(() => import("./pages/Dashboard/ResumeBuilder"));
const CareerAdvisor = lazy(() => import("./pages/Dashboard/CareerAdvisor"));
const JobTracker = lazy(() => import("./pages/Dashboard/JobTracker"));
const AIInterviews = lazy(() => import("./pages/Dashboard/AIInterviews"));
const ProfilePage = lazy(() => import("./pages/Dashboard/ProfilePage"));

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Header /><Hero /></>} />
        <Route path="/about" element={<><Header /><About /></>} />
        <Route path="/features" element={<><Header /><Features /></>} />
        <Route path="/resources" element={<><Header /><Resources /></>} />
        <Route path="/login" element={<><Header /><Login /></>} />
        <Route path="/register" element={<><Header /><Register /></>} />

        {/* Protected Routes with Sidebar + TopBar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route index element={<Dashboard />} />

          {/* Other Nested Routes */}
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="career-advisor" element={<CareerAdvisor />} />
          <Route path="job-tracker" element={<JobTracker />} />
          <Route path="ai-interviews" element={<AIInterviews />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
