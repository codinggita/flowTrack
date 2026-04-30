import Notification from '../models/Notification.js';
import { successResponse as ok, errorResponse as fail } from '../utils/apiResponse.js';

// GET /api/notifications
// Returns all notifications for logged-in user, newest first
export const getNotifications = async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const query = { userId: req.user.id };
  if (unreadOnly === 'true') query.isRead = false;

  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ userId: req.user.id, isRead: false });

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return ok(res, { notifications, unreadCount, total });
};

// GET /api/notifications/unread-count
// Lightweight — just returns the badge number, called every 30 seconds
export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ userId: req.user.id, isRead: false });
  return ok(res, { count });
};

// PUT /api/notifications/:id/read
// Mark a single notification as read
export const markAsRead = async (req, res) => {
  const notif = await Notification.findOne({ _id: req.params.id, userId: req.user.id });
  if (!notif) return fail(res, 'Notification not found', 404);
  notif.isRead = true;
  await notif.save();
  return ok(res, notif, 'Marked as read');
};

// PUT /api/notifications/mark-all-read
// Mark ALL notifications as read for this user
export const markAllAsRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
  return ok(res, null, 'All notifications marked as read');
};

// DELETE /api/notifications/:id
// Delete a single notification
export const deleteNotification = async (req, res) => {
  const notif = await Notification.findOne({ _id: req.params.id, userId: req.user.id });
  if (!notif) return fail(res, 'Notification not found', 404);
  await notif.deleteOne();
  return ok(res, null, 'Notification deleted');
};

// DELETE /api/notifications/clear-all
// Delete ALL notifications for this user
export const clearAllNotifications = async (req, res) => {
  await Notification.deleteMany({ userId: req.user.id });
  return ok(res, null, 'All notifications cleared');
};
