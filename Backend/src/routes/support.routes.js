import express from 'express';
import {
  getTickets,
  getTicket,
  createTicket,
  replyToTicket,
  rateTicket,
  closeTicket,
  getSupportStats,
} from '../controllers/support.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/',          getTickets);        // GET  /api/support
router.get('/stats',     getSupportStats);   // GET  /api/support/stats
router.post('/',         createTicket);      // POST /api/support
router.get('/:id',       getTicket);         // GET  /api/support/:id
router.post('/:id/reply',  replyToTicket);   // POST /api/support/:id/reply
router.post('/:id/rate',   rateTicket);      // POST /api/support/:id/rate
router.put('/:id/close',   closeTicket);     // PUT  /api/support/:id/close

export default router;
