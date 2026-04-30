import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [open,          setOpen]          = useState(false);
  const intervalRef = useRef(null);

  // Fetch unread count — lightweight, runs every 30 seconds
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (err) {
      // Silently fail — don't break the UI
    }
  }, []);

  // Fetch full notifications list — only when panel is opened
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications({ limit: 25 });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Notifications fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    intervalRef.current = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalRef.current);
  }, [fetchUnreadCount]);

  // When panel opens, load full list
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      const notif = notifications.find(n => n._id === id);
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (notif && !notif.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleClearAll = async () => {
    try {
      await api.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  return {
    notifications,
    unreadCount,
    loading,
    open,
    setOpen,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleClearAll,
  };
};
