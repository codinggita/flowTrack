import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-error', 'bg-accent-amber', 'bg-accent-blue', 'bg-primary'];
  const textColors = ['', 'text-error', 'text-accent-amber', 'text-accent-blue', 'text-primary'];

  if (!password) return null;

  return (
    <div className="flex items-center gap-3 mt-1 animate-fade-in">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              level <= strength ? colors[strength] : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-semibold ${textColors[strength]}`}>
        {labels[strength]}
      </span>
    </div>
  );
};

export default function SignUpPage() {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      terms: Yup.boolean()
        .oneOf([true], 'You must accept the terms to continue'),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      setTimeout(() => {
        console.log('SignUp Form Submitted →', values);
        navigate('/dashboard');
      }, 1000);
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden noise-overlay">
      {/* Animated Background Elements */}
      <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-accent-purple/8 rounded-full blur-3xl animate-morph"></div>
      <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-morph" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-float"></div>
      
      {/* Floating particles */}
      <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-accent-purple rounded-full opacity-35 animate-pulse-glow stagger-1"></div>
      <div className="absolute top-[40%] left-[15%] w-1.5 h-1.5 bg-primary rounded-full opacity-30 animate-pulse-glow stagger-3"></div>
      <div className="absolute bottom-[25%] right-[25%] w-2 h-2 bg-accent-cyan rounded-full opacity-25 animate-pulse-glow stagger-4"></div>
      <div className="absolute top-[70%] left-[40%] w-1.5 h-1.5 bg-accent-blue rounded-full opacity-30 animate-pulse-glow stagger-5"></div>

      {/* Top Branding */}
      <div className="relative z-10 flex flex-col items-center mb-10 animate-fade-in-up text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent-purple/10 border border-primary/30 rounded-2xl flex items-center justify-center shadow-glow mb-5">
          <span className="material-symbols-outlined text-3xl text-primary icon-fill">person_add</span>
        </div>
        <h1 className="text-4xl font-bold gradient-text tracking-tight mb-3">FlowTrack</h1>
        <h2 className="text-2xl font-semibold text-on-surface tracking-tight mb-3">Create account</h2>
        <p className="text-base text-on-surface-variant max-w-[420px] leading-relaxed">Join thousands of Indians who've taken control of their money with smart tracking.</p>
      </div>

      {/* Glass Card Form */}
      <main className="w-full max-w-[480px] glass-card rounded-3xl p-10 md:p-12 relative z-10 animate-fade-in-up stagger-2">
        <form className="flex flex-col gap-8" onSubmit={formik.handleSubmit} noValidate>
          {/* Full Name Field */}
          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-[0.08em] ml-0.5" htmlFor="signup-fullName">
              Full Name
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300">person</span>
              <input
                id="signup-fullName"
                name="fullName"
                type="text"
                className={`input-field ${formik.touched.fullName && formik.errors.fullName ? '!border-error !shadow-[0_0_0_3px_rgba(255,107,107,0.12)]' : ''}`}
                placeholder="Enter your full name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                autoComplete="name"
              />
            </div>
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="flex items-center gap-1.5 text-error text-[12px] ml-0.5 animate-fade-in">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {formik.errors.fullName}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-[0.08em] ml-0.5" htmlFor="signup-email">
              Email Address
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300">mail</span>
              <input
                id="signup-email"
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
            <label className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-[0.08em] ml-0.5" htmlFor="signup-password">
              Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors duration-300">lock</span>
              <input
                id="signup-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className={`input-field !pr-12 ${formik.touched.password && formik.errors.password ? '!border-error !shadow-[0_0_0_3px_rgba(255,107,107,0.12)]' : ''}`}
                placeholder="Min. 8 characters"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                autoComplete="new-password"
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
            <PasswordStrength password={formik.values.password} />
            {formik.touched.password && formik.errors.password && (
              <div className="flex items-center gap-1.5 text-error text-[12px] ml-0.5 animate-fade-in">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="mt-2">
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <input
                  id="signup-terms"
                  name="terms"
                  type="checkbox"
                  className="peer sr-only"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.terms}
                />
                <label 
                  htmlFor="signup-terms"
                  className="w-5 h-5 rounded-md border-2 border-outline-variant/60 bg-surface-container-low flex items-center justify-center cursor-pointer
                    peer-checked:bg-primary peer-checked:border-primary transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30"
                >
                  <span className="material-symbols-outlined text-[14px] text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                </label>
              </div>
              <label className="text-sm text-on-surface-variant leading-relaxed cursor-pointer" htmlFor="signup-terms">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline font-semibold">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline font-semibold">Privacy Policy</a>
              </label>
            </div>
            {formik.touched.terms && formik.errors.terms && (
              <div className="flex items-center gap-1.5 text-error text-[12px] ml-0.5 mt-1.5 animate-fade-in">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {formik.errors.terms}
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-8 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Or sign up with</span>
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

        {/* Login Link */}
        <div className="text-center mt-6 pt-4 border-t border-outline-variant/20">
          <p className="text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary font-bold hover:text-primary-fixed transition-all duration-300 hover:underline underline-offset-4 decoration-primary/50"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
