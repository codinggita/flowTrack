import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  updateNotifications,
  toggle2FA,
  getSessions,
  revokeSession,
  revokeAllOtherSessions,
  getActivityLog,
  getLoginHistory,
} from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

// Profile
router.get('/profile',           getProfile);
router.put('/profile',           updateProfile);
router.put('/preferences',       updatePreferences);
router.put('/password',          changePassword);
router.put('/notifications',     updateNotifications);
router.put('/2fa',               toggle2FA);

// Sessions
router.get('/sessions',                      getSessions);
router.delete('/sessions/:sessionId/revoke', revokeSession);
router.delete('/sessions/revoke-all',        revokeAllOtherSessions);

// Activity & Login history
router.get('/activity',      getActivityLog);
router.get('/login-history', getLoginHistory);

export default router;
