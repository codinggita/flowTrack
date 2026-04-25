import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
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
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div className="anim-logo-pop" style={{ marginBottom: '16px' }}>
            <Logo size={42} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '32px',
              color: 'var(--green)',
              marginBottom: '4px',
            }}
          >
            FlowTrack
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Terminal Authentication</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="anim-fade-up delay-1" style={{ marginBottom: '20px' }}>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@domain.com"
              className="input-field"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="anim-fade-up delay-2" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label-text">Password</label>
              <span style={{ color: 'var(--green)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>Forgot?</span>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="input-field"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>{formik.errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <div className="anim-fade-up delay-3">
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', height: '44px', fontSize: '15px' }}
            >
              Initialize Session
            </button>
          </div>

          {/* Divider */}
          <div className="anim-fade-up delay-4" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Social buttons */}
          <div className="anim-fade-up delay-5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button type="button" className="btn-ghost" style={{ height: '42px', fontSize: '14px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>G</span> Google
            </button>
            <button type="button" className="btn-ghost" style={{ height: '42px', fontSize: '14px' }}>
              <span style={{ fontSize: '18px' }}>🍎</span> Apple
            </button>
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
    </div>
  );
}
