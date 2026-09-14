import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, User, ShieldCheck, LogOut, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNav = () => {
  const { 
    user, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    setActiveTab, 
    setIsSidebarOpen,
    handleLogout,
    handleMarkAllNotificationsRead 
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0d1017]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between transition-all duration-300">
      {/* Left: Pop-up Sidebar Menu Trigger & Search Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-xl transition-all shadow-sm group"
          aria-label="Toggle navigation menu"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline">Menu</span>
        </button>

        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services, applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(prev => !prev);
              setIsProfileOpen(false);
            }}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-[#0d1017]" />
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-precise-up">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">Notifications ({unreadCount} new)</span>
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto mt-2">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="py-2 px-1 hover:bg-slate-800/50 rounded transition-colors cursor-pointer" onClick={() => { setActiveTab('notifications'); setIsNotificationsOpen(false); }}>
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-medium text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setIsNotificationsOpen(false);
                }}
                className="w-full mt-2 text-center text-xs text-orange-400 hover:text-orange-300 font-medium py-1"
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>

        {/* User Pill (Arjun Kumar) */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(prev => !prev);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
              {user.initials}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden sm:inline">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-precise-up">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <p className="text-[10px] text-orange-400 font-mono mt-0.5">ID: {user.citizenId}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('consent');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Consent Settings</span>
                </button>
              </div>
              <div className="border-t border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
