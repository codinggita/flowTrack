import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import ActivityLog from '../models/ActivityLog.js';
import { successResponse as ok, errorResponse as fail } from '../utils/apiResponse.js';
import { logActivity } from '../utils/sessionHelper.js';

// ── GET PROFILE ────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  return ok(res, {
    _id:           user._id,
    fullName:      user.fullName,
    email:         user.email,
    phone:         user.phone || '',
    plan:          user.plan,
    initials:      user.initials,
    accountId:     user.accountId,
    preferences:   user.preferences,
    notifications: user.notifications,
    twoFAEnabled:  user.twoFAEnabled,
    createdAt:     user.createdAt,
    lastLoginAt:   user.lastLoginAt,
    avatar:        user.avatar,
  });
};

// ── UPDATE PROFILE ─────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  const { fullName, phone, avatar } = req.body;
  const user = await User.findById(req.user.id);

  const changes = [];
  if (fullName && fullName !== user.fullName) {
    changes.push(`Name changed from "${user.fullName}" to "${fullName}"`);
    user.fullName = fullName;
  }
  if (phone !== undefined && phone !== user.phone) {
    changes.push('Phone number updated');
    user.phone = phone;
  }
  if (avatar !== undefined && avatar !== user.avatar) {
    changes.push('Avatar updated');
    user.avatar = avatar;
  }

  if (changes.length === 0) return ok(res, null, 'No changes made');

  await user.save();

  // Log the activity
  logActivity(req.user.id, 'profile_update', changes.join('. '), req, { changes }).catch(console.error);

  return ok(res, {
    fullName: user.fullName,
    phone:    user.phone,
    initials: user.initials,
    avatar:   user.avatar,
  }, 'Profile updated successfully');
};

// ── UPDATE PREFERENCES ─────────────────────────────────────────────────
export const updatePreferences = async (req, res) => {
  const { currency, language, theme } = req.body;
  const user = await User.findById(req.user.id);

  if (currency) user.preferences.currency = currency;
  if (language) user.preferences.language = language;
  if (theme)    user.preferences.theme    = theme;

  await user.save();
  logActivity(req.user.id, 'preferences_update', 'Preferences updated', req, { currency, language, theme }).catch(console.error);

  return ok(res, user.preferences, 'Preferences saved');
};

// ── CHANGE PASSWORD ────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return fail(res, 'Current password is incorrect', 400);

  if (currentPassword === newPassword)
    return fail(res, 'New password must be different from current password', 400);

  user.password          = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  // Revoke all other active sessions after password change (security best practice)
  const currentToken = req.headers.authorization?.split(' ')[1];
  await Session.updateMany(
    { userId: req.user.id, isActive: true, jwtToken: { $ne: currentToken } },
    { isActive: false, revokedAt: new Date() }
  );

  logActivity(req.user.id, 'password_change', 'Password changed. All other sessions revoked.', req).catch(console.error);

  return ok(res, null, 'Password changed successfully. Other sessions have been logged out.');
};

// ── UPDATE NOTIFICATION PREFERENCES ────────────────────────────────────
export const updateNotifications = async (req, res) => {
  const { newTransaction, weeklyReport, subRenewal } = req.body;
  const user = await User.findById(req.user.id);

  if (newTransaction !== undefined) user.notifications.newTransaction = newTransaction;
  if (weeklyReport   !== undefined) user.notifications.weeklyReport   = weeklyReport;
  if (subRenewal     !== undefined) user.notifications.subRenewal     = subRenewal;

  await user.save();
  return ok(res, user.notifications, 'Notification preferences saved');
};

// ── TOGGLE 2FA ──────────────────────────────────────────────────────────
export const toggle2FA = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.twoFAEnabled = !user.twoFAEnabled;
  await user.save();

  const action = user.twoFAEnabled ? '2fa_enabled' : '2fa_disabled';
  const msg    = user.twoFAEnabled ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled';
  logActivity(req.user.id, action, msg, req).catch(console.error);

  return ok(res, { twoFAEnabled: user.twoFAEnabled }, msg);
};

// ── GET ALL ACTIVE SESSIONS ─────────────────────────────────────────────
export const getSessions = async (req, res) => {
  const currentToken = req.headers.authorization?.split(' ')[1];

  const sessions = await Session.find({
    userId:   req.user.id,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).sort({ lastActiveAt: -1 });

  const formatted = sessions.map(s => ({
    _id:          s._id,
    device:       s.device,
    browser:      s.browser,
    os:           s.os,
    ipAddress:    s.ipAddress,
    location:     s.location,
    lastActiveAt: s.lastActiveAt,
    lastActiveAgo:s.lastActiveAgo,
    createdAt:    s.createdAt,
    expiresAt:    s.expiresAt,
    isCurrent:    s.jwtToken === currentToken || false,
  }));

  return ok(res, { sessions: formatted, totalSessions: formatted.length });
};

// ── REVOKE A SESSION ────────────────────────────────────────────────────
export const revokeSession = async (req, res) => {
  const session = await Session.findOne({ _id: req.params.sessionId, userId: req.user.id });
  if (!session) return fail(res, 'Session not found', 404);

  const currentToken = req.headers.authorization?.split(' ')[1];
  if (session.jwtToken === currentToken)
    return fail(res, 'Cannot revoke your current session. Use logout instead.', 400);

  session.isActive  = false;
  session.revokedAt = new Date();
  await session.save();

  logActivity(
    req.user.id, 'session_revoked',
    `Session revoked: ${session.device} from ${session.location.city || 'Unknown'}`,
    req, { revokedSessionId: session._id }
  ).catch(console.error);

  return ok(res, null, 'Session revoked successfully');
};

// ── REVOKE ALL OTHER SESSIONS ───────────────────────────────────────────
export const revokeAllOtherSessions = async (req, res) => {
  const currentToken = req.headers.authorization?.split(' ')[1];

  const result = await Session.updateMany(
    { userId: req.user.id, isActive: true, jwtToken: { $ne: currentToken } },
    { isActive: false, revokedAt: new Date() }
  );

  logActivity(
    req.user.id, 'session_revoked',
    `All other sessions revoked (${result.modifiedCount} sessions)`,
    req
  ).catch(console.error);

  return ok(res, { revokedCount: result.modifiedCount }, `${result.modifiedCount} sessions revoked`);
};

// ── GET ACTIVITY LOG ────────────────────────────────────────────────────
export const getActivityLog = async (req, res) => {
  const { page = 1, limit = 20, action } = req.query;
  const query = { userId: req.user.id };
  if (action) query.action = action;

  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await ActivityLog.countDocuments(query);
  const logs  = await ActivityLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return ok(res, { logs, total, page: +page, totalPages: Math.ceil(total / limit) });
};

// ── GET LOGIN HISTORY (activity logs of type 'login' only) ──────────────
export const getLoginHistory = async (req, res) => {
  const { limit = 10 } = req.query;
  const logs = await ActivityLog.find({ userId: req.user.id, action: 'login' })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return ok(res, logs);
};
