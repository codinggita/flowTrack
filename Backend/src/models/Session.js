import mongoose from 'mongoose';
import crypto from 'crypto';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Unique session token (hashed in DB, raw sent to client once)
  sessionToken: {
    type: String,
    required: true,
    index: true,
  },
  // Device & browser info parsed from User-Agent
  device: {
    type: String,
    default: 'Unknown Device',
  },
  browser: {
    type: String,
    default: 'Unknown Browser',
  },
  os: {
    type: String,
    default: 'Unknown OS',
  },
  // Network info
  ipAddress: {
    type: String,
    default: '0.0.0.0',
  },
  // Approximate location from IP (city, country)
  location: {
    city:    { type: String, default: 'Unknown' },
    country: { type: String, default: 'Unknown' },
    region:  { type: String, default: '' },
  },
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  // The JWT token associated with this session
  jwtToken: {
    type: String,
    select: false,
  },
  // Timestamps
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
  revokedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Auto-expire sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1, isActive: 1, lastActiveAt: -1 });

// Virtual: is this session expired?
sessionSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiresAt;
});

// Virtual: how long ago was this active
sessionSchema.virtual('lastActiveAgo').get(function () {
  const secs = Math.floor((Date.now() - this.lastActiveAt) / 1000);
  if (secs < 60)    return 'Active just now';
  if (secs < 3600)  return `Active ${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `Active ${Math.floor(secs / 3600)}h ago`;
  return `Active ${Math.floor(secs / 86400)}d ago`;
});

sessionSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Session', sessionSchema);
