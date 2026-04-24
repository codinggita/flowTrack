import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage  from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Login */}
        <Route path="/"        element={<Navigate to="/login" replace />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Catch-all → Login */}
        <Route path="*"        element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
