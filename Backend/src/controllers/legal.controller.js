import UserConsent from '../models/UserConsent.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const CURRENT_TERMS_VERSION   = 'v1.0';
const CURRENT_PRIVACY_VERSION = 'v1.0';

// GET /api/legal/consent-status
// Returns user's current consent status
export const getConsentStatus = async (req, res) => {
  let consent = await UserConsent.findOne({ userId: req.user.id });

  if (!consent) {
    consent = await UserConsent.create({ userId: req.user.id });
  }

  return successResponse(res, {
    hasRequiredConsents:     consent.hasRequiredConsents,
    termsOfService:          consent.termsOfService,
    privacyPolicy:           consent.privacyPolicy,
    marketing:               consent.marketing,
    analytics:               consent.analytics,
    dataRetention:           consent.dataRetention,
    currentTermsVersion:     CURRENT_TERMS_VERSION,
    currentPrivacyVersion:   CURRENT_PRIVACY_VERSION,
    termsUpToDate:           consent.termsOfService.version   === CURRENT_TERMS_VERSION,
    privacyUpToDate:         consent.privacyPolicy.version    === CURRENT_PRIVACY_VERSION,
  });
};

// POST /api/legal/accept
// Accept one or more consents at once
// Body: { termsOfService: true, privacyPolicy: true, marketing: true, analytics: true }
export const acceptConsents = async (req, res) => {
  const { termsOfService, privacyPolicy, marketing, analytics, dataRetention } = req.body;
  const ip        = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  const now       = new Date();

  let consent = await UserConsent.findOne({ userId: req.user.id });
  if (!consent) consent = new UserConsent({ userId: req.user.id });

  const historyEntries = [];

  if (termsOfService === true) {
    consent.termsOfService = {
      accepted:   true,
      acceptedAt: now,
      version:    CURRENT_TERMS_VERSION,
      ipAddress:  ip,
    };
    historyEntries.push({
      action: 'accepted', consentType: 'termsOfService',
      version: CURRENT_TERMS_VERSION, ipAddress: ip, userAgent, timestamp: now,
    });
  }

  if (privacyPolicy === true) {
    consent.privacyPolicy = {
      accepted:   true,
      acceptedAt: now,
      version:    CURRENT_PRIVACY_VERSION,
      ipAddress:  ip,
    };
    historyEntries.push({
      action: 'accepted', consentType: 'privacyPolicy',
      version: CURRENT_PRIVACY_VERSION, ipAddress: ip, userAgent, timestamp: now,
    });
  }

  if (marketing !== undefined) {
    consent.marketing.accepted    = marketing;
    consent.marketing.acceptedAt  = marketing ? now : consent.marketing.acceptedAt;
    consent.marketing.withdrawnAt = !marketing ? now : null;
    historyEntries.push({
      action: marketing ? 'accepted' : 'withdrawn',
      consentType: 'marketing', ipAddress: ip, userAgent, timestamp: now,
    });
  }

  if (analytics !== undefined) {
    consent.analytics.accepted    = analytics;
    consent.analytics.acceptedAt  = analytics ? now : consent.analytics.acceptedAt;
    consent.analytics.withdrawnAt = !analytics ? now : null;
    historyEntries.push({
      action: analytics ? 'accepted' : 'withdrawn',
      consentType: 'analytics', ipAddress: ip, userAgent, timestamp: now,
    });
  }

  if (dataRetention === true) {
    consent.dataRetention.accepted   = true;
    consent.dataRetention.acceptedAt = now;
  }

  consent.consentHistory.push(...historyEntries);
  await consent.save();

  return successResponse(res, {
    hasRequiredConsents: consent.hasRequiredConsents,
    termsOfService:      consent.termsOfService,
    privacyPolicy:       consent.privacyPolicy,
    marketing:           consent.marketing,
    analytics:           consent.analytics,
  }, 'Consent recorded successfully');
};

// PUT /api/legal/withdraw/:consentType
// Withdraw an optional consent (marketing, analytics only — cannot withdraw required ones)
export const withdrawConsent = async (req, res) => {
  const { consentType } = req.params;

  // Cannot withdraw required consents (must delete account instead)
  if (['termsOfService', 'privacyPolicy'].includes(consentType)) {
    return errorResponse(res, 'Required consents cannot be withdrawn. To delete your data, contact support.', 400);
  }

  if (!['marketing', 'analytics'].includes(consentType)) {
    return errorResponse(res, 'Invalid consent type', 400);
  }

  const ip        = req.headers['x-forwarded-for']?.split(',')[0] || '';
  const userAgent = req.headers['user-agent'] || '';

  const consent = await UserConsent.findOne({ userId: req.user.id });
  if (!consent) return errorResponse(res, 'Consent record not found', 404);

  consent[consentType].accepted    = false;
  consent[consentType].withdrawnAt = new Date();

  consent.consentHistory.push({
    action: 'withdrawn', consentType,
    ipAddress: ip, userAgent, timestamp: new Date(),
  });

  await consent.save();
  return successResponse(res, null, `${consentType} consent withdrawn`);
};

// GET /api/legal/consent-history
// Full audit trail of all consent actions
export const getConsentHistory = async (req, res) => {
  const consent = await UserConsent.findOne({ userId: req.user.id });
  if (!consent) return successResponse(res, []);
  return successResponse(res, consent.consentHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
};

// POST /api/legal/request-data-deletion
// User requests deletion of their account and all data
export const requestDataDeletion = async (req, res) => {
  const { reason } = req.body;
  // In a real app, this would trigger a deletion workflow
  // For now, log the request and return confirmation
  console.log(`Data deletion request from user ${req.user.id}: ${reason}`);
  return successResponse(res, null,
    'Your data deletion request has been received. We will process it within 30 days as required by law.');
};
