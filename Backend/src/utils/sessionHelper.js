import Session from '../models/Session.js';
import ActivityLog from '../models/ActivityLog.js';

// Parse User-Agent string into readable device/browser/OS info
export const parseUserAgent = (ua = '') => {
  let browser = 'Unknown Browser';
  let os      = 'Unknown OS';
  let device  = 'Desktop';

  // Browser detection
  if      (ua.includes('Edg/'))     browser = 'Microsoft Edge';
  else if (ua.includes('OPR/'))     browser = 'Opera';
  else if (ua.includes('Brave'))    browser = 'Brave';
  else if (ua.includes('Chrome/'))  browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';

  // OS detection
  if      (ua.includes('Windows NT 10'))  os = 'Windows 10';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Mac OS X'))       os = 'macOS';
  else if (ua.includes('Ubuntu'))         os = 'Ubuntu';
  else if (ua.includes('Linux'))          os = 'Linux';
  else if (ua.includes('Android'))        os = 'Android';
  else if (ua.includes('iPhone'))         os = 'iOS';
  else if (ua.includes('iPad'))           os = 'iPadOS';

  // Device type
  if      (ua.includes('Mobile'))  device = 'Mobile';
  else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';
  else                              device = 'Desktop';

  // Device string
  let deviceStr = `${device} — ${browser}`;
  if (ua.includes('iPhone'))       deviceStr = `iPhone — ${browser}`;
  else if (ua.includes('iPad'))    deviceStr = `iPad — ${browser}`;
  else if (ua.includes('Android')) deviceStr = `Android — ${browser}`;
  else if (ua.includes('Mac'))     deviceStr = `MacBook — ${browser}`;
  else if (ua.includes('Windows')) deviceStr = `Windows PC — ${browser}`;

  return { browser, os, device: deviceStr };
};

// Get client IP from request (handles proxies)
export const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    '0.0.0.0'
  );
};

// Create a new session record on login
export const createSession = async (userId, req, jwtToken) => {
  try {
    const ua        = req.headers['user-agent'] || '';
    const ip        = getClientIP(req);
    const { browser, os, device } = parseUserAgent(ua);

    // Use a random token as session identifier
    const sessionToken = Math.random().toString(36).slice(2) + Date.now().toString(36);

    const session = await Session.create({
      userId,
      sessionToken,
      device,
      browser,
      os,
      ipAddress: ip,
      location:  { city: 'India', country: 'IN', region: '' }, // can be enhanced with IP geolocation
      jwtToken,
      lastActiveAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { session, sessionToken };
  } catch (err) {
    console.error('Session creation error:', err.message);
    return { session: null, sessionToken: null };
  }
};

// Update lastActiveAt for existing session (called on each authenticated request)
export const touchSession = async (sessionToken) => {
  if (!sessionToken) return;
  try {
    await Session.findOneAndUpdate(
      { sessionToken, isActive: true },
      { lastActiveAt: new Date() }
    );
  } catch (err) {
    // non-critical, silent fail
  }
};

// Log any user action
export const logActivity = async (userId, action, description, req = null, metadata = {}, sessionId = null) => {
  try {
    const ip     = req ? getClientIP(req) : '0.0.0.0';
    const ua     = req?.headers?.['user-agent'] || '';
    const parsed = parseUserAgent(ua);

    await ActivityLog.create({
      userId,
      action,
      description,
      ipAddress: ip,
      device:    parsed.device,
      metadata,
      sessionId,
    });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};
