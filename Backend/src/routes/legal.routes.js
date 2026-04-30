import express from 'express';
import {
  getConsentStatus,
  acceptConsents,
  withdrawConsent,
  getConsentHistory,
  requestDataDeletion,
} from '../controllers/legal.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All legal routes require authentication
router.use(protect);

router.get('/consent-status',         getConsentStatus);
router.post('/accept',                acceptConsents);
router.put('/withdraw/:consentType',  withdrawConsent);
router.get('/consent-history',        getConsentHistory);
router.post('/request-data-deletion', requestDataDeletion);

export default router;
