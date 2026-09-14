import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  KeyRound, 
  CheckCheck, 
  Trash2 
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
        return <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>;
      case 'warning':
        return <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400"><AlertCircle className="w-5 h-5" /></div>;
      case 'auth':
        return <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400"><KeyRound className="w-5 h-5" /></div>;
      case 'system':
        return <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400"><Clock className="w-5 h-5" /></div>;
      default:
        return <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400"><Info className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-precise-up">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Notifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated with the latest updates on your applications and services.
          </p>
        </div>

        <button
          onClick={handleMarkAllNotificationsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-orange-400" />
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
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
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.read
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                  : 'bg-slate-900 border-slate-700/80 shadow-lg'
              }`}
            >
              {getIcon(notif.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                    {notif.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
