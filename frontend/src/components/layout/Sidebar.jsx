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
  ShieldAlert, 
  LogOut,
  ChevronRight,
  X,
  Pin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    handleLogout, 
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarPinned,
    setIsSidebarPinned
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'My Services', icon: Layers },
    { id: 'apply', label: 'Apply for Services', icon: FilePlus },
    { id: 'applications', label: 'My Applications', icon: FolderCheck },
    { id: 'tracking', label: 'Application Tracking', icon: Compass },
    { id: 'consent', label: 'Consent Management', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

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
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Pop-up / Drawer Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0c0f16]/98 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Close & Pin Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#080a0f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-1 flex items-center justify-center shadow-lg shadow-orange-500/20">
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
                <span className="text-xl font-bold tracking-tight text-white font-sans">Inter<span className="text-orange-500">Op</span></span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-0.5">Citizen Gateway</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Pin Toggle */}
            <button
              onClick={() => setIsSidebarPinned(prev => !prev)}
              title={isSidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar to Screen'}
              className={`p-1.5 rounded-lg text-xs transition-colors hidden md:inline-flex ${
                isSidebarPinned ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Pin className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-400'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-orange-600' : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </div>

        {/* Security Info Card */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded bg-orange-500/10 text-orange-400 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">Your data is secure</p>
              <p className="text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                We use industry-standard encryption to keep your information safe.
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-800/80 bg-[#080a0f]">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
