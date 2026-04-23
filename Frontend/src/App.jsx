import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Sign Up */}
        <Route path="/"        element={<Navigate to="/signup" replace />} />
        <Route path="/signup"  element={<SignUpPage />} />

        {/* Catch-all → Sign Up */}
        <Route path="*"        element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
