import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { useState } from 'react';

const registerSchema = Yup.object({
  fullName: Yup.string().min(2, 'Too short').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
  agree: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '', agree: false },
    validationSchema: registerSchema,
    onSubmit: () => {
      navigate('/dashboard');
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(66,229,176,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="card anim-scale-in" style={{ maxWidth: '480px', width: '100%', padding: '40px', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '32px',
              color: 'var(--green)',
              marginBottom: '8px',
            }}
          >
            FlowTrack
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Create your account to start managing finances.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Full Name */}
          <div className="anim-fade-up delay-1" style={{ marginBottom: '20px' }}>
            <label className="label-text">Full Name</label>
            <div style={{ position: 'relative' }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                name="fullName"
                placeholder="Arjun Sharma"
                className="input-field"
                style={{ paddingLeft: '40px' }}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.fullName && formik.errors.fullName && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="anim-fade-up delay-2" style={{ marginBottom: '20px' }}>
            <label className="label-text">Email Address</label>
            <div style={{ position: 'relative' }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="name@domain.com"
                className="input-field"
                style={{ paddingLeft: '40px' }}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="anim-fade-up delay-3" style={{ marginBottom: '20px' }}>
            <label className="label-text">Password</label>
            <div style={{ position: 'relative' }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '40px', paddingRight: '44px' }}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'flex',
                  padding: 0,
                }}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</p>
            )}
          </div>

          {/* Checkbox */}
          <div className="anim-fade-up delay-4" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="agree"
                checked={formik.values.agree}
                onChange={formik.handleChange}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--green)',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span style={{ color: 'var(--green)', cursor: 'pointer' }}>Terms of Service</span> and{' '}
                <span style={{ color: 'var(--green)', cursor: 'pointer' }}>Privacy Policy</span>
              </span>
            </label>
            {formik.touched.agree && formik.errors.agree && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.agree}</p>
            )}
          </div>

          {/* Submit */}
          <div className="anim-fade-up delay-5">
            <button type="submit" className="btn-primary" style={{ width: '100%', height: '44px', fontSize: '15px' }}>
              Create Account →
            </button>
          </div>

          {/* Divider */}
          <div className="anim-fade-up delay-6" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 500 }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Social buttons */}
          <div className="anim-fade-up delay-7" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button type="button" className="btn-ghost" style={{ height: '42px', fontSize: '14px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>G</span> Google
            </button>
            <button type="button" className="btn-ghost" style={{ height: '42px', fontSize: '14px' }}>
              <span style={{ fontSize: '18px' }}>🍎</span> Apple
            </button>
          </div>

          {/* Footer */}
          <div className="anim-fade-up delay-8" style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
                Log in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
