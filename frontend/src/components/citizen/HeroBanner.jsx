import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Building, 
  CheckCircle2, 
  Zap, 
  FileCheck,
  Megaphone,
  CreditCard,
  UserCheck
} from 'lucide-react';

export const HeroBanner = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    categoryFilter, 
    setCategoryFilter, 
    setActiveTab, 
    setIsAadhaarModalOpen,
    user
  } = useApp();

  const categories = ['All', 'Land & Transport', 'Certificates', 'Welfare & Schemes', 'Business & Taxes'];

  return (
    <div className="relative overflow-hidden mb-12">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 z-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        
        {/* Top Ticker Notification Banner (Matching 2nd Image Banner) */}
        <div className="mb-8 bg-blue-900/60 backdrop-blur-md border border-blue-700/50 rounded-xl p-2.5 flex items-center gap-3 overflow-hidden text-xs text-blue-100">
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-bold text-[11px] shrink-0 uppercase tracking-wider shadow-xs">
            <Megaphone className="w-3.5 h-3.5" />
            Official Bulletin
          </div>
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-ticker text-xs font-medium text-slate-200">
              ⚡ InterOp 2.0 Integration Live: Instant DigiLocker document auto-extraction enabled for all citizens &nbsp;&bull;&nbsp; 
              📜 Driving License renewal eKYC processing time reduced to under 3 days &nbsp;&bull;&nbsp; 
              🌾 PM-Kisan 18th Installment Aadhaar linking mandatory by end of month &nbsp;&bull;&nbsp;
              🏥 Ayushman Digital ABHA Health IDs now generated instantly via Aadhaar OTP
            </div>
          </div>
        </div>

        {/* Main Hero Banner Box (Matching Portal Resmi 2nd Image Hero Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Single Portal &bull; Multiple Government Departments &bull; One Identity</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Unified Citizen Services <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                Integration Platform
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Access 150+ central & state government services with automated AI document verification, single sign-on eKYC, and cross-department consent tracking.
            </p>

            {/* Main Interactive Search Input */}
            <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center flex-1 w-full px-3">
                <Search className="w-5 h-5 text-blue-600 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search service by name, department, or keyword..."
                  className="w-full py-2.5 bg-transparent text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>

              <button 
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Category Quick Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-400 font-medium mr-1">Quick Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3 py-1 rounded-lg transition-all font-semibold ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Right Cards & Identity Widget Box (Matching Image 1 & 2 Right Hero Box) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Identity Status Card */}
            <div className="bg-gradient-to-br from-slate-900/90 to-blue-950/90 border border-slate-700/80 backdrop-blur-xl p-5 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                    eKYC
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Aadhaar eKYC Status</h3>
                    <p className="text-[10px] text-slate-400">UIDAI Citizen Record Sync</p>
                  </div>
                </div>

                {user.isAadhaarLinked ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Linked & Active
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/50 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Aadhaar Token</div>
                  <div className="text-sm font-mono font-bold text-amber-300 tracking-wider">
                    {user.isAadhaarLinked ? user.aadhaarNumber : 'XXXX-XXXX-XXXX'}
                  </div>
                </div>

                <button
                  onClick={() => setIsAadhaarModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{user.isAadhaarLinked ? 'Manage' : 'Link Now'}</span>
                </button>
              </div>

              {/* 3 Key Stats Badges */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800">
                <div className="p-2 rounded-xl bg-slate-800/40">
                  <div className="text-lg font-black text-blue-400">3</div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Applications</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/40">
                  <div className="text-lg font-black text-emerald-400">2</div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Approved</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/40">
                  <div className="text-lg font-black text-amber-400">100%</div>
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Encrypted</div>
                </div>
              </div>

            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('applications')}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl flex items-center gap-3 transition-all group"
              >
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">Track Status</div>
                  <div className="text-[10px] text-slate-400">Check active applications</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('consent')}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl flex items-center gap-3 transition-all group"
              >
                <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">Consent Hub</div>
                  <div className="text-[10px] text-slate-400">Review data requests</div>
                </div>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
