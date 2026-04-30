import mongoose from 'mongoose';

// Tracks everything the user does — login, logout, transactions, settings changes
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  action: {
    type: String,
    enum: [
      'login', 'logout', 'register',
      'password_change', 'profile_update', 'preferences_update',
      '2fa_enabled', '2fa_disabled', 'session_revoked',
      'transaction_add', 'transaction_delete',
      'account_add', 'account_delete',
      'subscription_add', 'subscription_delete',
      'csv_import',
    ],
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: '0.0.0.0',
  },
  device: {
    type: String,
    default: 'Unknown',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null,
  },
}, { timestamps: true });

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, action: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);
