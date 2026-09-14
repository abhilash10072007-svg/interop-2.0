import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Eye, Globe, UserCheck, ShieldCheck } from 'lucide-react';

export const AccessibilityBar = () => {
  const { 
    fontSize, 
    setFontSize, 
    isHighContrast, 
    toggleHighContrast, 
    selectedLanguage, 
    setSelectedLanguage,
    role,
    setRole,
    showToast
  } = useApp();

  const handleRoleToggle = (newRole) => {
    setRole(newRole);
    if (newRole === 'officer') {
      showToast('Switched to Government Officer Review Queue Mode', 'info', 'Role Switch');
    } else {
      showToast('Switched to Citizen Service Portal Mode', 'info', 'Role Switch');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
      {/* Left: Emergency & Ticker */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium text-amber-400">
          <Phone className="w-3.5 h-3.5" />
          <span>Helpline: <strong>1800-11-2026</strong> (Toll Free)</span>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Government of India Digital Service Portal</span>
        </span>
      </div>

      {/* Right: Controls & Role Switch */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Role Switcher Pill */}
        <div className="bg-slate-800 p-0.5 rounded-lg flex items-center border border-slate-700">
          <button
            onClick={() => handleRoleToggle('citizen')}
            className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
              role === 'citizen' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Citizen Portal
          </button>
          <button
            onClick={() => handleRoleToggle('officer')}
            className={`px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1 transition-all ${
              role === 'officer' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Official Reviewer
          </button>
        </div>

        {/* Font Resizing */}
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          <span className="text-slate-400 mr-1 text-[11px]">Font:</span>
          <button 
            onClick={() => setFontSize('normal')}
            className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${fontSize === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
            title="Standard Font Size"
          >
            A
          </button>
          <button 
            onClick={() => setFontSize('large')}
            className={`px-1.5 py-0.2 rounded text-[12px] font-semibold ${fontSize === 'large' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
            title="Large Font Size"
          >
            A+
          </button>
        </div>

        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
            isHighContrast 
              ? 'bg-yellow-400 text-black border-yellow-300 font-bold' 
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contrast</span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
