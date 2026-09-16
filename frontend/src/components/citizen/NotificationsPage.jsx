import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  KeyRound, 
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsPage = () => {
  const { notifications, handleMarkNotificationRead, handleMarkAllNotificationsRead } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = ['All', 'Application Updates', 'System Updates', 'General'];

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    return n.category === activeFilter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200"><CheckCircle2 className="w-5 h-5" /></div>;
      case 'warning':
        return <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200"><AlertCircle className="w-5 h-5" /></div>;
      case 'auth':
        return <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200"><KeyRound className="w-5 h-5" /></div>;
      case 'system':
      default:
        return <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200"><Clock className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="light-card rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with real-time alerts across state departments and verified identity requests.
          </p>
        </div>

        <button
          onClick={handleMarkAllNotificationsRead}
          className="btn-press flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-semibold transition-colors self-start sm:self-auto border border-slate-200"
        >
          <CheckCheck className="w-4 h-4 text-orange-500" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
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

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif) => {
          return (
            <div
              key={notif.id}
              onClick={() => handleMarkNotificationRead(notif.id)}
              className={`light-card btn-press p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-4 ${
                notif.read
                  ? 'opacity-70 bg-white/80'
                  : 'bg-white border-l-4 border-l-orange-500 shadow-xs'
              }`}
            >
              {getIcon(notif.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
