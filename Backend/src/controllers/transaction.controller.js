import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import Notification from '../models/Notification.js';
import {
  notifyLargeExpense,
  notifyIncome,
  notifyLowBalance,
  notifyBudgetAlert,
} from '../utils/notificationHelper.js';
import { parseCSV } from '../utils/csvParser.js';
import { parseMonthPeriod } from '../utils/dateHelpers.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

export const getTransactions = async (req, res) => {
  const { period, category, type, search, accountId, page=1, limit=10 } = req.query;
  const query = { userId: req.user.id };

  if (period) {
    const { start, end } = parseMonthPeriod(period);
    query.date = { $gte:start, $lte:end };
  }
  if (category && category !== 'All Categories' && category !== 'all') query.category = category;
  if (type     && type     !== 'All'            && type     !== 'all') query.type = type.toLowerCase();
  if (accountId) query.accountId = accountId;
  if (search)    query.description = { $regex:search.trim(), $options:'i' };

  const skip  = (parseInt(page)-1) * parseInt(limit);
  const total = await Transaction.countDocuments(query);
  const data  = await Transaction.find(query)
    .populate('accountId','name type')
    .sort({ date:-1 }).skip(skip).limit(parseInt(limit));

  return paginatedResponse(res, data, total, page, limit);
};

export const createTransaction = async (req, res) => {
  const { accountId, amount, type, description, category, date, notes } = req.body;

  const account = await Account.findOne({ _id:accountId, userId:req.user.id });
  if (!account) return errorResponse(res, 'Account not found', 404);

  const transaction = await Transaction.create({
    userId:req.user.id, accountId, description, amount, type,
    category, date: date || new Date(), notes: notes || '',
  });

  // Auto-update account balance
  account.balance += type === 'income' ? amount : -amount;
  await account.save();

  // 1. Notify for large expense (> ₹5,000)
  if (type === 'expense' && amount >= 5000) {
    notifyLargeExpense(req.user.id, amount, description, category).catch(console.error);
  }

  // 2. Notify for any income
  if (type === 'income') {
    notifyIncome(req.user.id, amount, description).catch(console.error);
  }

  // 3. Notify if account balance dropped below ₹1,000 after this transaction
  if (type === 'expense' && account.balance < 1000 && account.balance >= 0) {
    notifyLowBalance(req.user.id, account.name, account.balance).catch(console.error);
  }

  // 4. Check monthly category spending and notify if > ₹10,000
  if (type === 'expense') {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyTotal = await Transaction.aggregate([
      { $match: {
        userId:    req.user.id,
        type:      'expense',
        category,
        date:      { $gte: startOfMonth },
      }},
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const total = monthlyTotal[0]?.total || 0;
    if (total >= 10000) {
      notifyBudgetAlert(req.user.id, category, total).catch(console.error);
    }
  }

  // Signal frontend to refresh graphs via response header
  res.setHeader('X-Data-Changed', 'transactions,reports,dashboard');

  const populated = await transaction.populate('accountId','name type');
  return successResponse(res, populated, 'Transaction added', 201);
};

export const updateTransaction = async (req, res) => {
  const tx = await Transaction.findOne({ _id:req.params.id, userId:req.user.id });
  if (!tx) return errorResponse(res, 'Transaction not found', 404);

  const account = await Account.findById(tx.accountId);
  if (account) {
    // Reverse old effect
    account.balance += tx.type === 'income' ? -tx.amount : tx.amount;
    // Apply new effect
    const newType   = req.body.type   || tx.type;
    const newAmount = req.body.amount || tx.amount;
    account.balance += newType === 'income' ? newAmount : -newAmount;
    await account.save();
  }

  Object.assign(tx, req.body);
  await tx.save();

  res.setHeader('X-Data-Changed', 'transactions,reports,dashboard');
  const populated = await tx.populate('accountId','name type');
  return successResponse(res, populated, 'Transaction updated');
};

export const deleteTransaction = async (req, res) => {
  const tx = await Transaction.findOne({ _id:req.params.id, userId:req.user.id });
  if (!tx) return errorResponse(res, 'Transaction not found', 404);

  const account = await Account.findById(tx.accountId);
  if (account) {
    account.balance += tx.type === 'income' ? -tx.amount : tx.amount;
    await account.save();
  }

  await tx.deleteOne();
  res.setHeader('X-Data-Changed', 'transactions,reports,dashboard');
  return successResponse(res, null, 'Transaction deleted');
};

export const uploadCSV = async (req, res) => {
  if (!req.file)        return errorResponse(res, 'No file uploaded', 400);
  if (!req.body.accountId) return errorResponse(res, 'accountId is required', 400);

  const account = await Account.findOne({ _id:req.body.accountId, userId:req.user.id });
  if (!account) return errorResponse(res, 'Account not found', 404);

  const rows    = await parseCSV(req.file.buffer);
  if (!rows.length) return errorResponse(res, 'No valid rows in CSV', 400);

  const docs    = rows.map(r => ({ ...r, userId:req.user.id, accountId:req.body.accountId, importedFromCSV:true }));
  const inserted = await Transaction.insertMany(docs, { ordered:false });

  // Recalculate balance
  const agg = await Transaction.aggregate([
    { $match: { accountId: new mongoose.Types.ObjectId(req.body.accountId) } },
    { $group: { _id:null,
      income:  { $sum:{ $cond:[{ $eq:['$type','income']  }, '$amount', 0] } },
      expense: { $sum:{ $cond:[{ $eq:['$type','expense'] }, '$amount', 0] } },
    }},
  ]);
  if (agg.length) { account.balance = agg[0].income - agg[0].expense; await account.save(); }

  return successResponse(res, { imported:inserted.length }, `${inserted.length} transactions imported`);
};
