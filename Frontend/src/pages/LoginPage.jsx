import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      console.log('Login Form Submitted →', values);
      // Simulate login and navigate
      // navigate('/dashboard');
    },
  });

  return (
    <div className="auth-page">
      {/* Floating particles decoration */}
      <span className="particle" style={{ top: '15%', left: '10%', animationDuration: '8s' }} />
      <span className="particle" style={{ top: '70%', left: '85%', animationDuration: '11s' }} />
      <span className="particle" style={{ top: '40%', left: '90%', animationDuration: '9s' }} />
      
      <main className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        <header className="auth-brand">
          <div className="auth-logo-icon">
            <span className="material-symbols-outlined filled">water_drop</span>
          </div>
          <h1 className="auth-title">FlowTrack</h1>
          <p className="auth-subtitle">Terminal Authentication</p>
        </header>

        <div className="auth-card-body">
          <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
            
            {/* Email Field */}
            <div className="form-field">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="form-input-wrap">
                <span className="material-symbols-outlined form-input-icon">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input has-icon ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="form-error">
                  <span className="material-symbols-outlined">error</span>
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="form-field">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password">Password</label>
                <a href="#" className="form-link">Forgot?</a>
              </div>
              <div className="form-input-wrap">
                <span className="material-symbols-outlined form-input-icon">lock</span>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={`form-input has-icon has-icon-right ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  className="form-input-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPass ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="form-error">
                  <span className="material-symbols-outlined">error</span>
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <button type="submit" className="btn-primary">
              Initialize Session
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Or continue with</span>
            <div className="auth-divider-line" />
          </div>

          <div className="social-grid">
            <button type="button" className="btn-social">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
          </div>

          <div className="auth-footer">
            <p>
              No active profile?
              <Link to="/signup">Request Access</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
