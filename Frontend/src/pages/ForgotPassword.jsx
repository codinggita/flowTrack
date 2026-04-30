import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import Logo from '../components/ui/Logo';
import LegalFooter from '../components/ui/LegalFooter';

const forgotPasswordSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export default function ForgotPassword() {
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setStatus({ type: '', msg: '' });
      try {
        const res = await api.forgotPassword(values);
        setStatus({ type: 'success', msg: res.message || 'Reset link sent to your email!' });
      } catch (err) {
        setStatus({ type: 'error', msg: err.message || 'Something went wrong' });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(66,229,176,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card anim-scale-in" style={{ maxWidth: '440px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo size={42} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--text)' }}>
            Recover Access
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '8px' }}>
            Enter your email and we'll send you a recovery link.
          </p>
        </div>

        {status.msg && (
          <div className="anim-fade-up" style={{
            background: status.type === 'error' ? 'rgba(255,77,77,0.08)' : 'rgba(66,229,176,0.08)',
            border: `1px solid ${status.type === 'error' ? 'rgba(255,77,77,0.3)' : 'rgba(66,229,176,0.3)'}`,
            borderRadius: 8, padding: '12px 16px', marginBottom: 24,
            color: status.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: 13,
            lineHeight: 1.5
          }}>
            {status.type === 'error' ? '❌' : '📧'} {status.msg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="anim-fade-up" style={{ marginBottom: '24px' }}>
            <label className="label-text">Email Address</label>
            <input type="email" name="email" placeholder="name@domain.com" className="input-field"
              value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', height: '44px', fontSize: '15px', marginBottom: '20px' }}>
            {loading ? 'Sending link...' : 'Send Recovery Link'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              ← Return to login
            </Link>
          </div>
        </form>
      </div>
      <LegalFooter />
    </div>
  );
}
