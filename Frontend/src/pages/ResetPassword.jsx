import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import Logo from '../components/ui/Logo';
import LegalFooter from '../components/ui/LegalFooter';

const resetPasswordSchema = Yup.object({
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
});

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setStatus({ type: '', msg: '' });
      try {
        await api.resetPassword(token, { password: values.password });
        setStatus({ type: 'success', msg: 'Password reset successful!' });
        setTimeout(() => navigate('/login'), 2000);
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
            New Password
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '8px' }}>
            Set a secure password for your FlowTrack profile.
          </p>
        </div>

        {status.msg && (
          <div className="anim-fade-up" style={{
            background: status.type === 'error' ? 'rgba(255,77,77,0.08)' : 'rgba(66,229,176,0.08)',
            border: `1px solid ${status.type === 'error' ? 'rgba(255,77,77,0.3)' : 'rgba(66,229,176,0.3)'}`,
            borderRadius: 8, padding: '12px 16px', marginBottom: 24,
            color: status.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: 13,
          }}>
            {status.type === 'error' ? '❌' : '✅'} {status.msg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="anim-fade-up" style={{ marginBottom: '20px' }}>
            <label className="label-text">New Password</label>
            <input type="password" name="password" placeholder="••••••••" className="input-field"
              value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.password && formik.errors.password && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</p>
            )}
          </div>

          <div className="anim-fade-up" style={{ marginBottom: '24px' }}>
            <label className="label-text">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" className="input-field"
              value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', height: '44px', fontSize: '15px' }}>
            {loading ? 'Updating password...' : 'Reset Password'}
          </button>
        </form>
      </div>
      <LegalFooter />
    </div>
  );
}
