import mongoose from 'mongoose';

const userConsentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Terms of Service consent
  termsOfService: {
    accepted:   { type: Boolean, default: false },
    acceptedAt: { type: Date,    default: null  },
    version:    { type: String,  default: ''    }, // e.g. "v1.0"
    ipAddress:  { type: String,  default: ''    },
  },

  // Privacy Policy consent
  privacyPolicy: {
    accepted:   { type: Boolean, default: false },
    acceptedAt: { type: Date,    default: null  },
    version:    { type: String,  default: ''    },
    ipAddress:  { type: String,  default: ''    },
  },

  // Optional consents (user can withdraw anytime)
  marketing: {
    // Weekly reports, tips, feature announcements
    accepted:   { type: Boolean, default: false },
    acceptedAt: { type: Date,    default: null  },
    withdrawnAt:{ type: Date,    default: null  },
  },

  analytics: {
    // Anonymous usage analytics to improve the app
    accepted:   { type: Boolean, default: true  },
    acceptedAt: { type: Date,    default: null  },
    withdrawnAt:{ type: Date,    default: null  },
  },

  dataRetention: {
    // User agrees data is kept for X years
    accepted:   { type: Boolean, default: false },
    acceptedAt: { type: Date,    default: null  },
    years:      { type: Number,  default: 3     },
  },

  // Full consent history (every accept/withdraw action)
  consentHistory: [{
    action:     { type: String }, // 'accepted' | 'withdrawn'
    consentType:{ type: String }, // 'termsOfService' | 'privacyPolicy' | 'marketing' | 'analytics'
    version:    { type: String },
    ipAddress:  { type: String },
    userAgent:  { type: String },
    timestamp:  { type: Date, default: Date.now },
  }],

}, { timestamps: true, toJSON: { virtuals: true } });

// Virtual: has user accepted all required consents?
userConsentSchema.virtual('hasRequiredConsents').get(function () {
  return this.termsOfService.accepted && this.privacyPolicy.accepted;
});

userConsentSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('UserConsent', userConsentSchema);
