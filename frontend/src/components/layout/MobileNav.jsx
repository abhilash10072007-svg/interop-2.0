import React from 'react';
import { LayoutDashboard, Layers, Compass, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'tracking', label: 'Applications', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1017]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all duration-200 ${
              isActive ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-orange-500' : ''}`} />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
