import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDateTime } from '../../utils/formatters';
import { Bell, CheckCheck, Clock, ShieldCheck, Wrench, Receipt, AlertCircle } from 'lucide-react';

const CustomerNotifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time updates regarding service orders, bay assignment, and billing.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-automotive-orange" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-automotive-orange text-white shadow-glow-orange'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'unread'
              ? 'bg-automotive-orange text-white shadow-glow-orange'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <Bell className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Notifications</h3>
          <p className="text-xs text-slate-400">
            {filter === 'unread' ? 'You have read all your alerts.' : 'No alerts in your inbox.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? 'bg-dark-900 border-automotive-orange/40 shadow-automotive'
                  : 'bg-dark-900/60 border-dark-800 hover:border-dark-750 opacity-80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.isRead
                    ? 'bg-automotive-orange/20 text-automotive-orange border border-automotive-orange/30'
                    : 'bg-dark-800 text-slate-400 border border-dark-750'
                }`}
              >
                {n.type === 'invoice' ? (
                  <Receipt className="w-5 h-5" />
                ) : n.type === 'service_update' ? (
                  <Wrench className="w-5 h-5" />
                ) : n.type === 'mechanic_assigned' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n._id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  title="Mark as read"
                >
                  <CheckCheck className="w-4 h-4 text-automotive-orange" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerNotifications;
