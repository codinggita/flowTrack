import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/ui/Logo';
import LegalFooter from '../components/ui/LegalFooter';

const registerSchema = Yup.object({
  fullName: Yup.string().min(2, 'Min 2 characters').max(50).required('Full name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms to continue'),
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      try {
        await register({ fullName: values.fullName, email: values.email, password: values.password });
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'Registration failed');
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

      <div className="card anim-scale-in" style={{ maxWidth: '480px', width: '100%', padding: '40px', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div className="anim-logo-pop" style={{ marginBottom: '16px' }}>
            <Logo size={42} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--green)', marginBottom: '4px' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Join FlowTrack — take control of your finances</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: 'var(--red)', fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="anim-fade-up delay-1" style={{ marginBottom: '16px' }}>
            <label className="label-text">Full Name</label>
            <input type="text" name="fullName" placeholder="Swaraj Prajapati" className="input-field"
              value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.fullName && formik.errors.fullName && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.fullName}</p>
            )}
          </div>

          <div className="anim-fade-up delay-2" style={{ marginBottom: '16px' }}>
            <label className="label-text">Email Address</label>
            <input type="email" name="email" placeholder="name@domain.com" className="input-field"
              value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</p>
            )}
          </div>

          <div className="anim-fade-up delay-3" style={{ marginBottom: '16px' }}>
            <label className="label-text">Password</label>
            <input type="password" name="password" placeholder="Min 8 characters" className="input-field"
              value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.password && formik.errors.password && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</p>
            )}
          </div>

          <div className="anim-fade-up delay-4" style={{ marginBottom: '24px' }}>
            <label className="label-text">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" className="input-field"
              value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.confirmPassword}</p>
            )}
          </div>

          <div className="anim-fade-up delay-5" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" name="acceptTerms"
                checked={formik.values.acceptTerms}
                onChange={formik.handleChange}
                style={{ marginTop: '3px', accentColor: 'var(--green)' }} />
              <span style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5' }}>
                I agree to FlowTrack's{' '}
                <Link to="/terms" target="_blank" style={{ color: 'var(--green)', textDecoration: 'none' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank" style={{ color: 'var(--green)', textDecoration: 'none' }}>Privacy Policy</Link>.
              </span>
            </label>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '6px' }}>{formik.errors.acceptTerms}</p>
            )}
          </div>

          <div className="anim-fade-up delay-6">
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', height: '44px', fontSize: '15px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="anim-fade-up delay-7" style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Already have a profile?{' '}
              <Link to="/login" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
                Initialize Session
              </Link>
            </span>
          </div>
        </form>
      </div>
      <LegalFooter />
    </div>
  );
}
