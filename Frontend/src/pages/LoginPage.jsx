import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      setTimeout(() => {
        console.log('Login Form Submitted →', values);
        navigate('/dashboard');
      }, 800);
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden noise-overlay">
      {/* Animated Background Elements */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-morph"></div>
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-accent-purple/6 rounded-full blur-3xl animate-morph" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-float"></div>
      
      {/* Floating particles */}
      <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-primary rounded-full opacity-40 animate-pulse-glow stagger-1"></div>
      <div className="absolute top-[35%] right-[30%] w-1.5 h-1.5 bg-accent-purple rounded-full opacity-30 animate-pulse-glow stagger-2"></div>
      <div className="absolute bottom-[30%] left-[15%] w-2.5 h-2.5 bg-accent-cyan rounded-full opacity-25 animate-pulse-glow stagger-3"></div>
      <div className="absolute top-[65%] right-[15%] w-1.5 h-1.5 bg-primary rounded-full opacity-35 animate-pulse-glow stagger-4"></div>
      <div className="absolute bottom-[15%] left-[45%] w-2 h-2 bg-accent-blue rounded-full opacity-20 animate-pulse-glow stagger-5"></div>

      {/* Top Branding */}
      <div className="relative z-10 flex flex-col items-center mb-10 animate-fade-in-up text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl flex items-center justify-center shadow-glow mb-5">
          <span className="material-symbols-outlined text-3xl text-primary icon-fill">water_drop</span>
        </div>
        <h1 className="text-4xl font-bold gradient-text tracking-tight mb-3">FlowTrack</h1>
        <h2 className="text-2xl font-semibold text-on-surface tracking-tight mb-3">Welcome back</h2>
        <p className="text-base text-on-surface-variant max-w-[420px] leading-relaxed">Enter your credentials to access your dashboard and take control of your finances.</p>
      </div>

      {/* Glass Card Form */}
      <main className="w-full max-w-[480px] glass-card rounded-3xl p-10 md:p-12 relative z-10 animate-fade-in-up stagger-2">
        <form className="flex flex-col gap-8" onSubmit={formik.handleSubmit} noValidate>
          {/* Email Field */}
          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-[0.08em] ml-0.5" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300">mail</span>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`input-field ${formik.touched.email && formik.errors.email ? '!border-error !shadow-[0_0_0_3px_rgba(255,107,107,0.12)]' : ''}`}
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                autoComplete="email"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="flex items-center gap-1.5 text-error text-[12px] ml-0.5 animate-fade-in">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center ml-0.5">
              <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-[0.08em]" htmlFor="login-password">
                Password
              </label>
              <a href="#" className="text-[12px] font-semibold text-primary hover:text-primary-fixed transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300">lock</span>
              <input
                id="login-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className={`input-field !pr-12 ${formik.touched.password && formik.errors.password ? '!border-error !shadow-[0_0_0_3px_rgba(255,107,107,0.12)]' : ''}`}
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPass ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="flex items-center gap-1.5 text-error text-[12px] ml-0.5 animate-fade-in">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary mt-4 flex items-center justify-center gap-2.5 group text-[17px] font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-8 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Or continue with</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
        </div>

        {/* Social Login */}
        <div className="flex flex-col sm:flex-row gap-5 mb-8">
          <button 
            type="button" 
            className="flex-1 glass border border-outline-variant/40 rounded-xl py-4 flex items-center justify-center gap-3 text-sm font-semibold hover:border-primary/30 hover:bg-surface-container-high/80 transition-all duration-300 group"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
            />
            <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Google</span>
          </button>
          <button 
            type="button" 
            className="flex-1 glass border border-outline-variant/40 rounded-xl py-4 flex items-center justify-center gap-3 text-sm font-semibold hover:border-primary/30 hover:bg-surface-container-high/80 transition-all duration-300 group"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface text-[20px] transition-colors">phone_iphone</span>
            <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Apple</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6 pt-4 border-t border-outline-variant/20">
          <p className="text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-primary font-bold hover:text-primary-fixed transition-all duration-300 hover:underline underline-offset-4 decoration-primary/50"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
