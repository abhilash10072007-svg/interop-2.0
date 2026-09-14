import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  User, 
  LogOut, 
  Layers, 
  CreditCard, 
  FileText, 
  Share2, 
  Megaphone, 
  BarChart3, 
  ShieldCheck,
  Building,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Header = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    role, 
    notifications, 
    markAllNotificationsRead,
    searchTerm, 
    setSearchTerm,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsAadhaarModalOpen,
    showToast
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      {/* Tricolor Government Top Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Government Crest Section */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavClick('home')}>
            {/* Simulated Ashoka Emblem / Government Crest */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-0.5 shadow-md flex items-center justify-center group transform transition-transform hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex flex-col items-center justify-center p-1 border border-amber-400/40 text-amber-400">
                <Building className="w-5 h-5" />
                <span className="text-[7px] font-extrabold tracking-tighter uppercase text-slate-200">INTEROP</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Inter<span className="text-blue-600">Op</span>
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Gov Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                National Citizen Government Services Integration Portal
              </p>
            </div>
          </div>

          {/* Quick Header Search Bar */}
          <div className="hidden lg:flex items-center relative flex-1 max-w-md mx-6">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 150+ services (Driving License, Pension, ABHA...)"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center gap-3">
            
            {/* Identity Status Pill */}
            {user.isAadhaarLinked ? (
              <div 
                onClick={() => setIsAadhaarModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                title="Click to view linked identity records"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <div className="text-[10px] text-emerald-700 font-normal leading-none">Aadhaar eKYC</div>
                  <div className="leading-none text-emerald-900 font-bold mt-0.5">Verified</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAadhaarModalOpen(true)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Link Aadhaar</span>
              </button>
            )}

            {/* Realtime Notification Bell with Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200/60"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-sm">Notifications & Updates</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-300 hover:text-white underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No recent notifications.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3.5 transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
                    Notifications real-time synced via InterOp Gateway
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-white hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight capitalize">{role} Account</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      Aadhaar: {user.aadhaarNumber}
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        handleNavClick('applications');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 font-medium flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      My Applications & Certificates
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('consent');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 font-medium flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      Data Consent Approvals
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('schemes');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 font-medium flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      Linked Government Schemes
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out / Switch User
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Portal Home</span>
          </button>

          <button
            onClick={() => handleNavClick('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Services Catalog</span>
          </button>

          <button
            onClick={() => handleNavClick('aadhaar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'aadhaar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Aadhaar & Record Linking</span>
          </button>

          <button
            onClick={() => handleNavClick('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Applications & Tracker</span>
          </button>

          <button
            onClick={() => handleNavClick('consent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'consent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Consent Hub</span>
          </button>

          <button
            onClick={() => handleNavClick('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notices'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Notice Board</span>
          </button>

          {role === 'officer' && (
            <button
              onClick={() => handleNavClick('officer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'officer'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Officer Review Queue</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Admin Analytics & Logs</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
