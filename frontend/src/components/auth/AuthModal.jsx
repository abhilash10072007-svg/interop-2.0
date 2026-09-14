import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, ShieldCheck, User, Building, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, setUser, showToast } = useApp();

  const [emailOrAadhaar, setEmailOrAadhaar] = useState('gokul.s@example.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      email: emailOrAadhaar.includes('@') ? emailOrAadhaar : prev.email
    }));
    
    setIsAuthModalOpen(false);
    showToast(`Welcome back! Authenticated as ${emailOrAadhaar}`, 'success', 'Session Active');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side Banner (Matching Image 1 Left Side Gateway) */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                iO
              </div>
              <span className="text-xl font-black">InterOp Portal</span>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-2xl font-black text-white leading-tight">
                Your Gateway to Government Services
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                Single Sign-On authentication for citizens, government officials, and system administrators.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-800/40 border border-blue-700/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Single Identity Sign-On</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-800/40 border border-blue-700/50 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Digitally Signed eKYC Verification</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] text-blue-300">
            Government Security Standard &bull; e-ID Protocol
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Mode Switcher Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalMode('login')}
                  className={`text-sm font-bold pb-1 transition-colors ${
                    authModalMode === 'login' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModalMode('signup')}
                  className={`text-sm font-bold pb-1 transition-colors ${
                    authModalMode === 'signup' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-semibold">Government SSO</span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Aadhaar / Registered Mobile / Email
                </label>
                <input
                  type="text"
                  required
                  value={emailOrAadhaar}
                  onChange={(e) => setEmailOrAadhaar(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{authModalMode === 'login' ? 'Sign In to InterOp' : 'Create Citizen Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials note */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 text-center">
              ⚡ Demo Mode: Pre-authenticated as <strong>Gokul S. (Citizen ID: INT-889412)</strong>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
