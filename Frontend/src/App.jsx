import { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import StructuredData from './components/seo/StructuredData';
import SEOHead from './components/seo/SEOHead';
import ConsentGate from './components/ui/ConsentGate';
import { api } from './services/api';

// ── LAZY LOAD ALL PAGES — zero JS until needed ──────────────────────────
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Transactions  = lazy(() => import('./pages/Transactions'));
const Accounts      = lazy(() => import('./pages/Accounts'));
const Reports       = lazy(() => import('./pages/Reports'));
const Recurring     = lazy(() => import('./pages/Recurring'));
const Settings      = lazy(() => import('./pages/Settings'));
const Support       = lazy(() => import('./pages/Support'));
const TermsOfService= lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ForgotPassword= lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AppLayout     = lazy(() => import('./components/layout/AppLayout'));

// ── LOADING FALLBACK — shown while page chunk loads ─────────────────────
const PageLoader = () => (
  <div style={{
    display:'flex', alignItems:'center', justifyContent:'center',
    height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16,
  }}>
    <div style={{
      width:44, height:44, borderRadius:'50%',
      border:'3px solid var(--border)', borderTop:'3px solid var(--green)',
      animation:'spin 0.8s linear infinite',
    }} />
    <p style={{ color:'var(--muted)', fontSize:13 }}>Loading FlowTrack...</p>
  </div>
);

// ── MAP ROUTES TO SEO PAGE KEYS ─────────────────────────────────────────
const PAGE_SEO_MAP = {
  '/dashboard':'dashboard', '/transactions':'transactions', '/accounts':'accounts',
  '/reports':'reports', '/recurring':'recurring', '/settings':'settings',
  '/support':'support', '/login':'login', '/register':'register',
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'var(--bg)', color:'var(--green)', fontFamily:'var(--font-display)', fontSize:18, gap:16 }}>
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

function AppRoutes() {
  const location = useLocation();
  const seoPage = useMemo(() => PAGE_SEO_MAP[location.pathname] || 'home', [location.pathname]);

  return (
    <>
      <SEOHead page={seoPage} />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </>
  );
}

export default function App() {
  const [consentChecked, setConsentChecked] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);

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
        <StructuredData />
        {consentChecked && needsConsent && isLoggedIn && !isAuthPage && (
          <ConsentGate onAccepted={() => setNeedsConsent(false)} />
        )}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
