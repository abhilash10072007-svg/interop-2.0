import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  KeyRound,
  CheckCheck,
  Bell,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

const NotificationsPage = () => {
  const {
    notifications = [],
    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');

  const safeNotifications = Array.isArray(notifications)
    ? notifications
    : [];

  /*
   * Filter live notifications.
   */
  const filteredNotifs = useMemo(() => {
    if (activeFilter === 'All') {
      return safeNotifications;
    }

    return safeNotifications.filter((notification) => {
      return notification?.category === activeFilter;
    });
  }, [safeNotifications, activeFilter]);

  /*
   * Count unread notifications.
   */
  const unreadCount = safeNotifications.filter(
    (notification) => !notification?.read
  ).length;

  /*
   * Notification icon.
   */
  const getIcon = (type) => {
    const normalizedType = String(type || '').toLowerCase();

    if (
      normalizedType === 'success' ||
      normalizedType === 'approved'
    ) {
      return (
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      );
    }

    if (
      normalizedType === 'warning' ||
      normalizedType === 'rejected'
    ) {
      return (
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
          <AlertCircle className="w-5 h-5" />
        </div>
      );
    }

    if (
      normalizedType === 'auth' ||
      normalizedType === 'consent'
    ) {
      return (
        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
          <KeyRound className="w-5 h-5" />
        </div>
      );
    }

    return (
      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
        <Clock className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="light-card rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Stay updated with real-time alerts across government
            departments and application services.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllNotificationsRead}
            className="btn-press flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-semibold transition-colors self-start sm:self-auto border border-slate-200"
          >
            <CheckCheck className="w-4 h-4 text-orange-500" />
            <span>Mark all as read</span>
          </button>
        )}

      </div>

      {/* =====================================================
          FILTER TABS
      ====================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">

        {[
          'All',
          'Application Updates',
          'System Updates',
          'General',
        ].map((tab) => {

          const isActive = activeFilter === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`btn-press px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}

      </div>

      {/* =====================================================
          NOTIFICATION LIST
      ====================================================== */}
      <div className="space-y-3">

        {filteredNotifs.length === 0 ? (

          <div className="light-card rounded-2xl py-16 px-6 text-center">

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-slate-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-800">
              {activeFilter === 'All'
                ? 'No notifications'
                : 'No notifications in this category'}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {activeFilter === 'All'
                ? 'New application and system updates will appear here.'
                : 'Try selecting another notification category.'}
            </p>

          </div>

        ) : (

          filteredNotifs.map((notif, index) => {

            const notificationId =
              notif?.id ||
              notif?.notificationId ||
              `notification-${index}`;

            const title =
              notif?.title ||
              'Notification';

            const message =
              notif?.message ||
              'You have a new notification.';

            const time =
              notif?.time ||
              notif?.createdAt ||
              notif?.created_at ||
              '';

            const isRead =
              notif?.read === true;

            return (
              <div
                key={notificationId}
                onClick={() => {
                  if (
                    !isRead &&
                    handleMarkNotificationRead
                  ) {
                    handleMarkNotificationRead(
                      notificationId
                    );
                  }
                }}
                className={`light-card btn-press p-4 rounded-2xl transition-all flex items-start gap-4 ${
                  !isRead
                    ? 'bg-white border-l-4 border-l-orange-500 shadow-xs cursor-pointer'
                    : 'opacity-70 bg-white/80'
                }`}
              >

                {/* Icon */}
                {getIcon(notif?.type)}

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-2">

                    <div className="flex items-center gap-2 min-w-0">

                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {title}
                      </h3>

                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                      )}

                    </div>

                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {time}
                    </span>

                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {message}
                  </p>

                  {notif?.category && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-semibold">
                      {notif.category}
                    </span>
                  )}

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
};

export { NotificationsPage };
export default NotificationsPage;