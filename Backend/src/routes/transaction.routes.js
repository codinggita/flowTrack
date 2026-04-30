import express from 'express';
import multer from 'multer';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, uploadCSV } from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema, updateTransactionSchema } from '../validations/transaction.validation.js';

const router  = express.Router();
const upload  = multer({ storage:multer.memoryStorage(), limits:{ fileSize:5*1024*1024 } });

router.use(protect);
router.get('/',            getTransactions);
router.post('/',           validate(createTransactionSchema), createTransaction);
router.put('/:id',         validate(updateTransactionSchema), updateTransaction);
router.delete('/:id',      deleteTransaction);
router.post('/csv-upload', upload.single('file'), uploadCSV);
export default router;
