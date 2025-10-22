import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';

import DashboardLayout from '../layouts/DashboardLayout.tsx';
import ProtectedRoute from '../components/ProtectedRoute'; // ✅ Import the protection

// Dashboard Pages
import Overview from '../pages/Dashboard/Overview';
import Jobs from '../pages/Dashboard/JobTracker';
import Resume from '../pages/Dashboard/ResumeBuilder';
import Assistant from '../components/Assistant';
import Profile from '../pages/Dashboard/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="resume" element={<Resume />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
