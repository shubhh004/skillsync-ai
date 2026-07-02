import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import DsaPage from '../features/dsa/DsaPage';
import ResumePage from '../features/resume/ResumePage';
import JobsPage from '../features/jobs/JobsPage';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dsa"       element={<ProtectedRoute><DsaPage /></ProtectedRoute>} />
      <Route path="/resume"    element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
      <Route path="/jobs"      element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
      <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
