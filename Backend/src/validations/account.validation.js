import Joi from 'joi';

export const createAccountSchema = Joi.object({
  name:    Joi.string().min(2).max(50).required(),
  type:    Joi.string().valid('UPI','BANK','CREDIT_CARD','WALLET').required(),
  balance: Joi.number().default(0),
  icon:    Joi.string().max(3).allow('').optional(),
  color:   Joi.string().allow('').optional(),
});

export const updateAccountSchema = Joi.object({
  name:    Joi.string().min(2).max(50).optional(),
  balance: Joi.number().optional(),
  icon:    Joi.string().max(3).allow('').optional(),
  color:   Joi.string().allow('').optional(),
});
