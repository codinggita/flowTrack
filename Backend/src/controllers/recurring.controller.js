import Subscription from '../models/Subscription.js';
import Transaction from '../models/Transaction.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getSubscriptions = async (req, res) => {
  const subs = await Subscription.find({ userId:req.user.id, isActive:true })
    .populate('accountId','name type').sort({ nextRenewalDate:1 });

  const totalMonthly     = subs.reduce((s,sub) => s + sub.monthlyAmount, 0);
  const yearlyProjection = totalMonthly * 12;
  const upcoming7days    = subs.filter(s => s.isRenewingSoon).length;

  const thirtyAgo = new Date(Date.now() - 30*24*60*60*1000);
  let unusedCount = 0;
  for (const sub of subs) {
    const last = await Transaction.findOne({
      userId: req.user.id,
      description: { $regex:sub.name, $options:'i' },
      date: { $gte:thirtyAgo },
    });
    if (!last) unusedCount++;
  }

  return successResponse(res, {
    subscriptions: subs,
    stats: {
      totalMonthly:      Math.round(totalMonthly),
      yearlyProjection:  Math.round(yearlyProjection),
      activeSubs:        subs.length,
      upcoming7days,
      optimizationScore: Math.max(0, 100 - unusedCount*10),
    },
  });
};

export const createSubscription = async (req, res) => {
  const sub = await Subscription.create({ userId:req.user.id, ...req.body,
    letter: req.body.letter || req.body.name[0].toUpperCase() });
  return successResponse(res, sub, 'Subscription added', 201);
};

export const updateSubscription = async (req, res) => {
  const sub = await Subscription.findOne({ _id:req.params.id, userId:req.user.id });
  if (!sub) return errorResponse(res, 'Subscription not found', 404);
  Object.assign(sub, req.body);
  await sub.save();
  return successResponse(res, sub, 'Subscription updated');
};

export const deleteSubscription = async (req, res) => {
  const sub = await Subscription.findOne({ _id:req.params.id, userId:req.user.id });
  if (!sub) return errorResponse(res, 'Subscription not found', 404);
  sub.isActive = false;
  await sub.save();
  return successResponse(res, null, 'Subscription removed');
};
