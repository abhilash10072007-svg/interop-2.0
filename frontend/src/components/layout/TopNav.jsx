import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, User, ShieldCheck, LogOut } from 'lucide-react';
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
    handleMarkAllNotificationsRead,
    isBackendConnected
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between transition-all duration-300 shadow-xs">
      {/* Left: Pop-up Sidebar Menu Trigger & Search Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="btn-press flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-orange-600 bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 rounded-xl transition-all shadow-xs group"
          aria-label="Toggle navigation menu"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-slate-800">Menu</span>
        </button>

        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services, schemes, tracking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/70 hover:bg-slate-100/90 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right: Notifications, Live API Badge & User Profile */}
      <div className="flex items-center gap-3">
        {/* Backend API Connectivity Pill */}
        <div 
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border bg-slate-50 transition-all border-slate-200/90"
          title={isBackendConnected ? "FastAPI backend is connected and live" : "Running in standalone mode with responsive mock fallbacks"}
        >
          <span className={'w-2 h-2 rounded-full ' + (isBackendConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400')} />
          <span className={isBackendConnected ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-medium'}>
            {isBackendConnected ? 'FastAPI Live' : 'Standalone Mode'}
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(prev => !prev);
              setIsProfileOpen(false);
            }}
            className="btn-press relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-50 animate-precise-up">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications ({unreadCount} new)</span>
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="py-2 px-1 hover:bg-orange-50/50 rounded-lg transition-colors cursor-pointer" onClick={() => { setActiveTab('notifications'); setIsNotificationsOpen(false); }}>
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setIsNotificationsOpen(false);
                }}
                className="w-full mt-2 text-center text-xs text-orange-600 hover:text-orange-700 font-semibold py-1 rounded-md hover:bg-orange-50"
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
            className="btn-press flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-orange-50/50 border border-slate-200 transition-all duration-200 shadow-2xs"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.initials}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 animate-precise-up">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <p className="text-[10px] text-orange-600 font-mono mt-0.5 font-semibold">ID: {user.citizenId}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('consent');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Consent Settings</span>
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
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
