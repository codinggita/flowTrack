import express from 'express';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../controllers/recurring.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createSubscriptionSchema } from '../validations/recurring.validation.js';

const router = express.Router();
router.use(protect);
router.get('/',       getSubscriptions);
router.post('/',      validate(createSubscriptionSchema), createSubscription);
router.put('/:id',    updateSubscription);
router.delete('/:id', deleteSubscription);
export default router;
