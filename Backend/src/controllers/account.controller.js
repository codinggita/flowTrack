import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAccounts = async (req, res) => {
  const accounts  = await Account.find({ userId:req.user.id, isActive:true }).sort({ createdAt:1 });
  const netWorth  = accounts.reduce((s,a) => s + a.balance, 0);
  return successResponse(res, { accounts, netWorth });
};

export const createAccount = async (req, res) => {
  const { name, type, balance=0, icon, color } = req.body;
  const finalBalance = type === 'CREDIT_CARD' && balance > 0 ? -Math.abs(balance) : balance;
  const account = await Account.create({
    userId: req.user.id, name, type,
    balance: finalBalance,
    icon:  icon  || name.slice(0,2).toUpperCase(),
    color: color || '#242c28',
  });
  return successResponse(res, account, 'Account created', 201);
};

export const updateAccount = async (req, res) => {
  const account = await Account.findOne({ _id:req.params.id, userId:req.user.id });
  if (!account) return errorResponse(res, 'Account not found', 404);
  Object.assign(account, req.body);
  await account.save();
  return successResponse(res, account, 'Account updated');
};

export const deleteAccount = async (req, res) => {
  const account = await Account.findOne({ _id:req.params.id, userId:req.user.id });
  if (!account) return errorResponse(res, 'Account not found', 404);
  const count = await Transaction.countDocuments({ accountId:account._id });
  if (count > 0) {
    account.isActive = false;
    await account.save();
    return successResponse(res, null, `Account deactivated. ${count} transactions preserved.`);
  }
  await account.deleteOne();
  return successResponse(res, null, 'Account deleted');
};
