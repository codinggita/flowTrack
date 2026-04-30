import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { getPeriodRange } from '../utils/dateHelpers.js';
import { successResponse } from '../utils/apiResponse.js';

const toId = id => new mongoose.Types.ObjectId(id);

const CATEGORY_COLORS = {
  Food:'#42e5b0', Transport:'#ff9467', Shopping:'#ffbca2',
  Income:'#42b0e5', Housing:'#e5b042', Utilities:'#3c4a43',
  Software:'#7c42e5', Tech:'#e542a0', Investment:'#a0e542', Others:'#2a3530',
};

// GET /api/reports/summary?period=this-month
export const getSummary = async (req, res) => {
  const { start, end } = getPeriodRange(req.query.period || 'this-month');

  const [result] = await Transaction.aggregate([
    { $match: { userId:toId(req.user.id), date:{ $gte:start, $lte:end } } },
    { $group: { _id:null,
      totalIncome:   { $sum:{ $cond:[{ $eq:['$type','income']  }, '$amount', 0] } },
      totalExpenses: { $sum:{ $cond:[{ $eq:['$type','expense'] }, '$amount', 0] } },
      txCount:       { $sum:1 },
    }},
  ]);

  const d = result || { totalIncome:0, totalExpenses:0, txCount:0 };
  d.netSavings    = d.totalIncome - d.totalExpenses;
  d.savingsMargin = d.totalIncome > 0 ? Math.round((d.netSavings/d.totalIncome)*100) : 0;
  d.period        = req.query.period;

  return successResponse(res, d);
};

// GET /api/reports/spending-by-category?period=this-month
export const getSpendingByCategory = async (req, res) => {
  const { start, end } = getPeriodRange(req.query.period || 'this-month');

  const result = await Transaction.aggregate([
    { $match: { userId:toId(req.user.id), type:'expense', date:{ $gte:start, $lte:end } } },
    { $group: { _id:'$category', total:{ $sum:'$amount' }, count:{ $sum:1 } } },
    { $sort:  { total:-1 } },
  ]);

  const totalExpenses = result.reduce((s,r) => s+r.total, 0);
  const categories    = result.map(r => ({
    category: r._id,
    amount:   r.total,
    count:    r.count,
    percent:  totalExpenses > 0 ? Math.round((r.total/totalExpenses)*100) : 0,
    color:    CATEGORY_COLORS[r._id] || '#85948c',
  }));

  return successResponse(res, { categories, totalExpenses });
};

// GET /api/reports/spending-by-merchant?period=this-month
export const getSpendingByMerchant = async (req, res) => {
  const { start, end } = getPeriodRange(req.query.period || 'this-month');

  const result = await Transaction.aggregate([
    { $match: { userId:toId(req.user.id), type:'expense', date:{ $gte:start, $lte:end } } },
    { $group: { _id:'$description', total:{ $sum:'$amount' }, count:{ $sum:1 } } },
    { $sort:  { total:-1 } },
    { $limit: 10 },
  ]);

  const max  = result[0]?.total || 1;
  const data = result.map(r => ({
    name:    r._id,
    amount:  r.total,
    count:   r.count,
    percent: Math.round((r.total/max)*100),
  }));

  return successResponse(res, data);
};

// GET /api/reports/cash-flow?year=2024
export const getCashFlow = async (req, res) => {
  const year  = parseInt(req.query.year) || new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end   = new Date(year, 11, 31, 23, 59, 59);

  const result = await Transaction.aggregate([
    { $match: { userId:toId(req.user.id), date:{ $gte:start, $lte:end } } },
    { $group: { _id:{ month:{ $month:'$date' }, type:'$type' }, total:{ $sum:'$amount' } } },
    { $sort:  { '_id.month':1 } },
  ]);

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data   = MONTHS.map((month, i) => {
    const num      = i + 1;
    const income   = result.find(r => r._id.month===num && r._id.type==='income')?.total   || 0;
    const expenses = result.find(r => r._id.month===num && r._id.type==='expense')?.total  || 0;
    return { month, income, expenses, savings: income - expenses };
  });

  return successResponse(res, { year, data });
};

// GET /api/reports/top-categories?period=this-month
export const getTopCategories = async (req, res) => {
  const { start, end } = getPeriodRange(req.query.period || 'this-month');

  const result = await Transaction.aggregate([
    { $match: { userId:toId(req.user.id), type:'expense', date:{ $gte:start, $lte:end } } },
    { $group: { _id:'$category', total:{ $sum:'$amount' }, count:{ $sum:1 } } },
    { $sort:  { total:-1 } },
    { $limit: 6 },
  ]);

  const grand = result.reduce((s,r) => s+r.total, 0);
  const data  = result.map(r => ({
    category: r._id,
    amount:   r.total,
    count:    r.count,
    percent:  grand > 0 ? Math.round((r.total/grand)*100) : 0,
    color:    CATEGORY_COLORS[r._id] || '#85948c',
  }));

  return successResponse(res, data);
};

// GET /api/reports/dashboard-stats
export const getDashboardStats = async (req, res) => {
  const { start, end } = getPeriodRange('this-month');
  const userId = toId(req.user.id);

  const [summary, categories, recentTx] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId, date:{ $gte:start, $lte:end } } },
      { $group: { _id:null,
        totalIncome:   { $sum:{ $cond:[{ $eq:['$type','income']  }, '$amount', 0] } },
        totalExpenses: { $sum:{ $cond:[{ $eq:['$type','expense'] }, '$amount', 0] } },
      }},
    ]),
    Transaction.aggregate([
      { $match: { userId, type:'expense', date:{ $gte:start, $lte:end } } },
      { $group: { _id:'$category', total:{ $sum:'$amount' }, count:{ $sum:1 } } },
      { $sort:  { total:-1 } },
    ]),
    Transaction.find({ userId }).sort({ date:-1 }).limit(8).populate('accountId','name type'),
  ]);

  const s             = summary[0] || { totalIncome:0, totalExpenses:0 };
  s.netSavings        = s.totalIncome - s.totalExpenses;
  s.savingsMargin     = s.totalIncome > 0 ? Math.round((s.netSavings/s.totalIncome)*100) : 0;
  const totalExpenses = categories.reduce((a,c) => a+c.total, 0);

  return successResponse(res, {
    summary: s,
    spendingByCategory: categories.map(c => ({
      category: c._id,
      amount:   c.total,
      count:    c.count,
      percent:  totalExpenses > 0 ? Math.round((c.total/totalExpenses)*100) : 0,
      color:    CATEGORY_COLORS[c._id] || '#85948c',
    })),
    recentTransactions: recentTx,
  });
};
