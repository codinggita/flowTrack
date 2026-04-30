import Joi from 'joi';

const CATEGORIES = ['Food','Transport','Shopping','Income','Housing','Utilities','Software','Tech','Investment','Others'];

export const createTransactionSchema = Joi.object({
  accountId:   Joi.string().required(),
  description: Joi.string().min(1).max(100).required(),
  amount:      Joi.number().positive().required(),
  type:        Joi.string().valid('income','expense').required(),
  category:    Joi.string().valid(...CATEGORIES).required(),
  date:        Joi.date().optional().default(new Date()),
  notes:       Joi.string().max(500).allow('').optional(),
});

export const updateTransactionSchema = Joi.object({
  description: Joi.string().min(1).max(100).optional(),
  amount:      Joi.number().positive().optional(),
  type:        Joi.string().valid('income','expense').optional(),
  category:    Joi.string().valid(...CATEGORIES).optional(),
  date:        Joi.date().optional(),
  notes:       Joi.string().max(500).allow('').optional(),
});
