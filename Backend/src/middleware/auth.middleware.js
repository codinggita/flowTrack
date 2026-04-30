import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { touchSession } from '../utils/sessionHelper.js';

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });

  try {
    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });

    req.user = user;

    // Update session lastActiveAt in background (non-blocking)
    const sessionToken = req.headers['x-session-token'];
    if (sessionToken) touchSession(sessionToken).catch(() => {});

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: e.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token.',
    });
  }
};
