import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  User, 
  ShieldCheck, 
  LogOut,
  Users,
  ShieldAlert,
  BarChart3,
  Server,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNav = () => {
  const { 
    user, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    setActiveTab, 
    setIsSidebarOpen,
    handleMarkAllNotificationsRead,
    isBackendConnected,
    currentPortal,
    setCurrentPortal,
    citizenId,
    handleSwitchCitizen,
    refreshBackendData
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [tempCitizenId, setTempCitizenId] = useState(citizenId);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between transition-all duration-300 shadow-xs">
      
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
        <div className="relative hidden md:block w-60 lg:w-72">
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

      {/* Center: Interactive Portal / Role Switcher (Citizen | Officer | Admin) */}
      <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => {
            setCurrentPortal('citizen');
            setActiveTab('dashboard');
          }}
          className={`btn-press px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentPortal === 'citizen'
              ? 'bg-white text-orange-600 shadow-xs border border-orange-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Citizen</span>
        </button>

        <button
          onClick={() => {
            setCurrentPortal('officer');
            setActiveTab('review-queue');
          }}
          className={`btn-press px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentPortal === 'officer'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Officer (U002)</span>
        </button>

        <button
          onClick={() => {
            setCurrentPortal('admin');
            setActiveTab('analytics');
          }}
          className={`btn-press px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentPortal === 'admin'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>

      {/* Right: Citizen Switcher, Live Badge, Notification, Profile */}
      <div className="flex items-center gap-2.5">
        
        {/* Quick Citizen Switch Input */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-bold text-slate-400">ID:</span>
          <input
            type="text"
            value={tempCitizenId}
            onChange={(e) => setTempCitizenId(e.target.value)}
            onBlur={() => handleSwitchCitizen(tempCitizenId)}
            onKeyDown={(e) => e.key === 'Enter' && handleSwitchCitizen(tempCitizenId)}
            className="w-16 font-mono font-bold text-orange-600 bg-transparent text-xs focus:outline-hidden text-center"
            title="Type Citizen ID and press Enter (e.g. C001)"
          />
        </div>

        {/* Backend Live Indicator */}
        <div 
          onClick={() => refreshBackendData(citizenId)}
          className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-50 transition-all border-slate-200"
          title="Click to refresh FastAPI data from port 8001"
        >
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`} />
          <span className={`hidden sm:inline ${isBackendConnected ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-medium'}`}>
            {isBackendConnected ? ':8001 Live' : 'Offline'}
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
                  <div 
                    key={n.id} 
                    className="py-2 px-1 hover:bg-orange-50/50 rounded-lg transition-colors cursor-pointer" 
                    onClick={() => { 
                      setActiveTab('notifications'); 
                      setIsNotificationsOpen(false); 
                    }}
                  >
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

        {/* User Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(prev => !prev);
              setIsNotificationsOpen(false);
            }}
            className="btn-press flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white hover:bg-orange-50/50 border border-slate-200 transition-all duration-200 shadow-2xs"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.initials}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[100px]">{user.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 animate-precise-up">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <p className="text-[10px] text-orange-600 font-mono mt-0.5 font-semibold">Active ID: {citizenId}</p>
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
                    setActiveTab('unified');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Unified Citizen Record</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
