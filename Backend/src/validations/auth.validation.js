import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  phone:    Joi.string().allow('').optional(),
});

export const loginSchema = Joi.object({
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     Joi.string().min(8).required(),
});

export const googleAuthSchema = Joi.object({
  credential: Joi.string().required(),
});
