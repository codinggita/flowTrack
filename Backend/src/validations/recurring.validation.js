import Joi from 'joi';

export const createSubscriptionSchema = Joi.object({
  accountId:       Joi.string().required(),
  name:            Joi.string().min(1).max(100).required(),
  plan:            Joi.string().allow('').optional(),
  amount:          Joi.number().positive().required(),
  billingCycle:    Joi.string().valid('monthly','yearly','weekly').default('monthly'),
  nextRenewalDate: Joi.date().required(),
  color:           Joi.string().allow('').optional(),
  letter:          Joi.string().max(2).optional(),
});
