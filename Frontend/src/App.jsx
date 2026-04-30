import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import Recurring from './pages/Recurring';
import Settings from './pages/Settings';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy  from './pages/PrivacyPolicy';
import ConsentGate    from './components/ui/ConsentGate';
import Support        from './pages/Support';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import { api } from './services/api';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'var(--bg)', color:'var(--green)', fontFamily:'var(--font-display)', fontSize:18, gap: 16 }}>
      <div className="spinner"></div>
      Loading FlowTrack...
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const [consentChecked, setConsentChecked]   = useState(false);
  const [needsConsent,   setNeedsConsent]     = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('ft_token');
  const isAuthPage = ['/login','/register','/signup','/terms','/privacy'].includes(window.location.pathname);

  useEffect(() => {
    if (!isLoggedIn || isAuthPage) {
      setConsentChecked(true);
      return;
    }
    api.getConsentStatus()
      .then(res => {
        setNeedsConsent(!res.data.hasRequiredConsents);
        setConsentChecked(true);
      })
      .catch(() => setConsentChecked(true));
  }, [isLoggedIn, window.location.pathname]);

  return (
    <AuthProvider>
      <BrowserRouter>
        {consentChecked && needsConsent && isLoggedIn && !isAuthPage && (
          <ConsentGate onAccepted={() => setNeedsConsent(false)} />
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
          <Route path="/reset-password/:token" element={<AuthRoute><ResetPassword /></AuthRoute>} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/recurring" element={<Recurring />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
