import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';

import DashboardLayout from '../layouts/Dashboardlayout';

// Dashboard Pages
import Overview from '../pages/Dashboard/Overview';
import Jobs from '../pages/Dashboard/Jobs';
import Resume from '../pages/Dashboard/Resume';
import Assistant from '../pages/Dashboard/Assistant';
import Profile from '../pages/Dashboard/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes (Protected + Layout) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
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
