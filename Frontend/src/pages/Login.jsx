import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/ui/Logo';
import LegalFooter from '../components/ui/LegalFooter';

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      try {
        await login(values);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  // Google Sign-In setup
  const handleGoogleCallback = useCallback(async (response) => {
    setError('');
    setLoading(true);
    try {
      await googleLogin(response.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }, [googleLogin, navigate]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your_google_client_id') return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      });
      window.google?.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'filled_black', size: 'large', width: '100%', text: 'signin_with', shape: 'rectangular' }
      );
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [handleGoogleCallback]);

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your_google_client_id') {
      setError('Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
      return;
    }
    // If GSI library loaded, prompt
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(66,229,176,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card anim-scale-in" style={{ maxWidth: '480px', width: '100%', padding: '40px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div className="anim-logo-pop" style={{ marginBottom: '16px' }}>
            <Logo size={42} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '32px', color: 'var(--green)', marginBottom: '4px' }}>
            FlowTrack
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Terminal Authentication</p>
        </div>

        {error && (
          <div className="anim-fade-up" style={{
            background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: 'var(--red)', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="anim-fade-up delay-1" style={{ marginBottom: '20px' }}>
            <label className="label-text">Email Address</label>
            <input type="email" name="email" placeholder="name@domain.com" className="input-field"
              value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</p>
            )}
          </div>

          <div className="anim-fade-up delay-2" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label-text">Password</label>
              <Link to="/forgot-password" style={{ color: 'var(--green)', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>Forgot?</Link>
            </div>
            <input type="password" name="password" placeholder="••••••••" className="input-field"
              value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.password && formik.errors.password && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</p>
            )}
          </div>

          <div className="anim-fade-up delay-3">
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', height: '44px', fontSize: '15px' }}>
              {loading ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderTopColor: '#003828' }}></div>
                  Authenticating...
                </>
              ) : 'Initialize Session'}
            </button>
          </div>

          {/* Divider */}
          <div className="anim-fade-up delay-4" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Google Sign-In */}
          <div className="anim-fade-up delay-5" style={{ display: 'flex', justifyContent: 'center' }}>
            <div id="google-signin-btn" />
          </div>

          {/* Footer */}
          <div className="anim-fade-up delay-6" style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
              No active profile?{' '}
              <Link to="/register" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
                Request Access
              </Link>
            </span>
          </div>
        </form>
      </div>
      <LegalFooter />
    </div>
  );
}
