import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  FilePlus, 
  FolderCheck, 
  Compass, 
  ShieldCheck, 
  Bell, 
  User, 
  ChevronRight,
  X,
  Pin,
  GitCompare,
  UserCheck,
  ShieldAlert,
  BarChart3,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarPinned,
    setIsSidebarPinned,
    user,
    currentPortal,
    setCurrentPortal,
    citizenId,
    officerId
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Portal-aware navigation items
  const getNavItems = () => {
    if (currentPortal === 'officer') {
      return [
        { id: 'review-queue', label: 'Review Queue', icon: ShieldAlert, badge: 0 },
        { id: 'unified', label: 'Citizen Dossier', icon: UserCheck },
        { id: 'reconciliation', label: 'Reconciliation Log', icon: GitCompare }
      ];
    }

    if (currentPortal === 'admin') {
      return [
        { id: 'analytics', label: 'Platform Telemetry', icon: BarChart3 },
        { id: 'reconciliation', label: 'Reconciliation Audits', icon: GitCompare },
        { id: 'unified', label: 'Citizen Data Mesh', icon: UserCheck }
      ];
    }

    // Default: Citizen Portal
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'unified', label: 'Unified Citizen Record', icon: UserCheck },
      { id: 'reconciliation', label: 'Reconciliation Audit', icon: GitCompare, badge: 1 },
      { id: 'services', label: 'My Services', icon: Layers },
      { id: 'apply', label: 'Apply for Services', icon: FilePlus },
      { id: 'applications', label: 'My Applications', icon: FolderCheck },
      { id: 'tracking', label: 'Application Tracking', icon: Compass },
      { id: 'consent', label: 'Consent Management', icon: ShieldCheck },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isSidebarPinned) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Pop-up Backdrop Overlay (when not pinned) */}
      {isSidebarOpen && !isSidebarPinned && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Pop-up / Drawer Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white text-slate-800 flex flex-col border-r border-slate-200/90 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Close & Pin Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-1 flex items-center justify-center shadow-md shadow-orange-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <path d="m5.6 5.6 12.8 12.8" />
                <path d="m18.4 5.6-12.8 12.8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">Inter<span className="text-orange-500">Op</span></span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-0.5">
                {currentPortal === 'officer' ? 'Official Reviewer' : currentPortal === 'admin' ? 'System Administration' : 'Citizen Gateway'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Pin Toggle */}
            <button
              onClick={() => setIsSidebarPinned(prev => !prev)}
              title={isSidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar to Screen'}
              className={`btn-press p-1.5 rounded-lg text-xs transition-colors hidden md:inline-flex ${
                isSidebarPinned ? 'bg-orange-100 text-orange-600 font-bold' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Pin className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="btn-press p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close menu"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portal Switcher Quick Strip */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/40">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/60 rounded-xl text-center text-[11px] font-bold">
            <button
              onClick={() => { setCurrentPortal('citizen'); setActiveTab('dashboard'); }}
              className={`py-1 rounded-lg transition-all ${currentPortal === 'citizen' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Citizen
            </button>
            <button
              onClick={() => { setCurrentPortal('officer'); setActiveTab('review-queue'); }}
              className={`py-1 rounded-lg transition-all ${currentPortal === 'officer' ? 'bg-amber-500 text-slate-950 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Officer
            </button>
            <button
              onClick={() => { setCurrentPortal('admin'); setActiveTab('analytics'); }}
              className={`py-1 rounded-lg transition-all ${currentPortal === 'admin' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`btn-press w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/80 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Context Pill */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentPortal === 'officer' ? 'OF' : currentPortal === 'admin' ? 'AD' : user.initials}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentPortal === 'officer' ? 'Officer Mode' : currentPortal === 'admin' ? 'Administrator' : user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {currentPortal === 'officer' ? officerId : currentPortal === 'admin' ? 'ROOT' : citizenId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
