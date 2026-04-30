import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword, googleAuth } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, googleAuthSchema } from '../validations/auth.validation.js';

const router = express.Router();
router.post('/register',              validate(registerSchema),       register);
router.post('/login',                 validate(loginSchema),          login);
router.post('/google',                validate(googleAuthSchema),     googleAuth);
router.post('/forgot-password',       validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema),  resetPassword);
router.get('/me',                     protect,                        getMe);
export default router;
