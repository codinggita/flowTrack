import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect); // all notification routes require login

router.get('/',                  getNotifications);       // GET  /api/notifications
router.get('/unread-count',      getUnreadCount);         // GET  /api/notifications/unread-count
router.put('/mark-all-read',     markAllAsRead);          // PUT  /api/notifications/mark-all-read
router.delete('/clear-all',      clearAllNotifications);  // DELETE /api/notifications/clear-all
router.put('/:id/read',          markAsRead);             // PUT  /api/notifications/:id/read
router.delete('/:id',            deleteNotification);     // DELETE /api/notifications/:id

export default router;
