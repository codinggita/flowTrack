import express from 'express';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/account.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createAccountSchema, updateAccountSchema } from '../validations/account.validation.js';

const router = express.Router();
router.use(protect);
router.get('/',      getAccounts);
router.post('/',     validate(createAccountSchema), createAccount);
router.put('/:id',   validate(updateAccountSchema), updateAccount);
router.delete('/:id', deleteAccount);
export default router;
