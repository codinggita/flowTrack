import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const baseStyle = `font-family:Inter,sans-serif;max-width:520px;margin:0 auto;
  background:#0e1511;color:#dce4de;padding:40px;border-radius:12px;`;

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from:`"FlowTrack" <${process.env.EMAIL_USER}>`, to, subject, html });
    return true;
  } catch (e) { console.error('Email error:', e.message); return false; }
};

export const sendWelcomeEmail = (user) => sendEmail({
  to: user.email,
  subject: 'Welcome to FlowTrack 🌊',
  html: `<div style="${baseStyle}">
    <h1 style="color:#42e5b0;">FlowTrack</h1>
    <h2>Welcome, ${user.fullName}!</h2>
    <p style="color:#bbcac1;">Your account is ready. Start tracking your finances.</p>
    <a href="${process.env.CLIENT_URL}/dashboard"
      style="display:inline-block;background:#42e5b0;color:#003828;padding:12px 28px;
      border-radius:8px;text-decoration:none;font-weight:700;margin-top:20px;">
      Open Dashboard →</a>
  </div>`,
});

export const sendPasswordResetEmail = (user, token) => sendEmail({
  to: user.email,
  subject: 'FlowTrack — Password Reset',
  html: `<div style="${baseStyle}">
    <h1 style="color:#42e5b0;">FlowTrack</h1>
    <h2>Reset Your Password</h2>
    <p style="color:#bbcac1;">This link expires in 10 minutes.</p>
    <a href="${process.env.CLIENT_URL}/reset-password/${token}"
      style="display:inline-block;background:#42e5b0;color:#003828;padding:12px 28px;
      border-radius:8px;text-decoration:none;font-weight:700;margin-top:20px;">
      Reset Password →</a>
  </div>`,
});

export const sendWeeklyReportEmail = (user, stats) => sendEmail({
  to: user.email,
  subject: 'FlowTrack — Weekly Report 📊',
  html: `<div style="${baseStyle}">
    <h1 style="color:#42e5b0;">Weekly Report</h1>
    <p style="color:#85948c;">Hi ${user.fullName}, here's your week:</p>
    <div style="background:#1a211d;padding:16px;border-radius:8px;border:1px solid #3c4a43;margin:16px 0;">
      <p style="color:#42e5b0;font-size:20px;font-weight:700;">
        Income: ₹${stats.income.toLocaleString('en-IN')}</p>
      <p style="color:#ff4d4d;font-size:20px;font-weight:700;">
        Expenses: ₹${stats.expenses.toLocaleString('en-IN')}</p>
    </div>
    <a href="${process.env.CLIENT_URL}/reports"
      style="display:inline-block;background:#42e5b0;color:#003828;padding:12px 28px;
      border-radius:8px;text-decoration:none;font-weight:700;">View Full Report →</a>
  </div>`,
});
