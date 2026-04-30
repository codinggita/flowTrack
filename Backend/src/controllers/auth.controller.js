import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/sendEmail.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Session from '../models/Session.js';
import { createSession, logActivity } from '../utils/sessionHelper.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const safeUser = (user) => ({
  _id: user._id, fullName: user.fullName, email: user.email,
  phone: user.phone, plan: user.plan, initials: user.initials,
  accountId: user.accountId, preferences: user.preferences,
  notifications: user.notifications, twoFAEnabled: user.twoFAEnabled,
  avatar: user.avatar || '',
});

export const register = async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  if (await User.findOne({ email })) return errorResponse(res, 'Email already registered', 409);
  const user  = await User.create({ fullName, email, password, phone });
  const token = generateToken(user._id);

  // Create initial session
  const { session, sessionToken } = await createSession(user._id, req, token);

  // Log registration
  logActivity(user._id, 'register', 'Account created', req, {}, session?._id).catch(console.error);

  sendWelcomeEmail(user).catch(console.error);
  return successResponse(res, { token, sessionToken, user: safeUser(user) }, 'Account created', 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password || !(await user.comparePassword(password)))
    return errorResponse(res, 'Invalid email or password', 401);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  // Create session record
  const { session, sessionToken } = await createSession(user._id, req, token);

  // Log login activity
  logActivity(user._id, 'login', `Logged in from ${req.headers['user-agent']?.slice(0,50) || 'Unknown'}`, req, {}, session?._id).catch(console.error);

  return successResponse(res, { token, sessionToken, user: safeUser(user) }, 'Login successful');
};

export const googleAuth = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    let isNewUser = false;

    if (user) {
      // Link google account if user exists by email but not googleId
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
      }
      user.lastLoginAt = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      // Create new user from Google data
      user = await User.create({
        fullName: name,
        email,
        googleId,
        avatar: picture || '',
      });
      isNewUser = true;
      sendWelcomeEmail(user).catch(console.error);
    }

    const token = generateToken(user._id);
    const { session, sessionToken } = await createSession(user._id, req, token);

    if (isNewUser) {
      logActivity(user._id, 'register', 'Account created via Google', req, {}, session?._id).catch(console.error);
    } else {
      logActivity(user._id, 'login', `Logged in via Google from ${req.headers['user-agent']?.slice(0,50) || 'Unknown'}`, req, {}, session?._id).catch(console.error);
    }

    return successResponse(res, { token, sessionToken, user: safeUser(user) }, 'Google login successful');
  } catch (err) {
    console.error('Google auth error:', err.message);
    return errorResponse(res, 'Google authentication failed', 401);
  }
};

export const getMe = async (req, res) => successResponse(res, safeUser(req.user));

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken   = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 10*60*1000);
    await user.save({ validateBeforeSave:false });
    sendPasswordResetEmail(user, token).catch(console.error);
  }
  return successResponse(res, null, 'If this email exists, a reset link has been sent.');
};

export const resetPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user   = await User.findOne({
    resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) return errorResponse(res, 'Reset link invalid or expired', 400);
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return successResponse(res, null, 'Password reset successful');
};
