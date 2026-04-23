import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function SignUpPage() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      terms: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, 'Name is too short')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      terms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions'),
    }),
    onSubmit: (values) => {
      console.log('SignUp Form Submitted →', values);
      // Simulate registration and navigate
      // navigate('/dashboard');
    },
  });

  return (
    <div className="auth-page">
      {/* Floating particles decoration */}
      <span className="particle" style={{ top: '10%', left: '5%',  animationDuration: '9s' }} />
      <span className="particle" style={{ top: '65%', left: '88%', animationDuration: '12s' }} />
      
      <main className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="auth-card-body">
          <div className="auth-brand" style={{ marginBottom: '8px' }}>
            <h1 className="auth-title">FlowTrack</h1>
            <p className="auth-subtitle">Create your account to start managing finances.</p>
          </div>

          <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
            
            {/* Full Name Field */}
            <div className="form-field">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <div className="form-input-wrap">
                <span className="material-symbols-outlined form-input-icon">person</span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-input has-icon ${formik.touched.fullName && formik.errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="form-error">
                  <span className="material-symbols-outlined">error</span>
                  {formik.errors.fullName}
                </div>
              ) : null}
            </div>

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
              <label className="form-label" htmlFor="password">Password</label>
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

            {/* Terms Checkbox */}
            <div>
              <div className="form-checkbox-row">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="form-checkbox"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.terms}
                />
                <label className="form-checkbox-label" htmlFor="terms">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </label>
              </div>
              {formik.touched.terms && formik.errors.terms ? (
                <div className="form-error">
                  <span className="material-symbols-outlined">error</span>
                  {formik.errors.terms}
                </div>
              ) : null}
            </div>

            <button type="submit" className="btn-primary">
              Create Account
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
              Already have an account?
              <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
