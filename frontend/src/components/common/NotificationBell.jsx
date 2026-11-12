import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDateTime } from '../../utils/formatters';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-dark-750 transition"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-automotive-orange text-[10px] font-bold text-white shadow-glow-orange">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-dark-900 border border-dark-700/80 shadow-automotive-lg z-50 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-dark-750 flex items-center justify-between bg-dark-850/60">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-automotive-orange/20 text-automotive-orange rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-automotive-orange hover:text-orange-400 flex items-center gap-1 font-medium transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-dark-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`p-4 transition cursor-pointer hover:bg-dark-800/60 flex gap-3 ${
                    !n.isRead ? 'bg-automotive-orange/5' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      !n.isRead ? 'bg-automotive-orange shadow-glow-orange' : 'bg-slate-700'
                    }`}
                  />
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
