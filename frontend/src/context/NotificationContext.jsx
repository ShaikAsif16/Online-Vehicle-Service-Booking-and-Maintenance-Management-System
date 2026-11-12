import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // 30s background sync
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      addToast('All notifications marked as read', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-center justify-between transition-all transform animate-slide-in ${
                isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
                  : isError
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-100'
                  : isWarning
                  ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
                  : 'bg-dark-850/95 border-automotive-orange/40 text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full animate-ping bg-automotive-orange" />
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-60 hover:opacity-100 ml-3 text-slate-300"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};
