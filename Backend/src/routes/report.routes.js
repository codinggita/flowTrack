import express from 'express';
import { getSummary, getSpendingByCategory, getSpendingByMerchant, getCashFlow, getTopCategories, getDashboardStats } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);
router.get('/summary',               getSummary);
router.get('/spending-by-category',  getSpendingByCategory);
router.get('/spending-by-merchant',  getSpendingByMerchant);
router.get('/cash-flow',             getCashFlow);
router.get('/top-categories',        getTopCategories);
router.get('/dashboard-stats',       getDashboardStats);
export default router;
