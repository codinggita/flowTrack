import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage  from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Login */}
        <Route path="/"        element={<Navigate to="/login" replace />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignUpPage />} />

        {/* Catch-all → Login */}
        <Route path="*"        element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
