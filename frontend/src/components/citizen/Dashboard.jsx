import React, { useState, useEffect } from 'react';
import { 
  FilePlus, 
  Fingerprint, 
  UploadCloud, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// High-precision Count-Up Hook for Stats
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}

export const Dashboard = () => {
  const { 
    user, 
    applications, 
    notifications, 
    setActiveTab, 
    setSelectedApplicationDetails, 
    setIsAadhaarModalOpen,
    setSelectedServiceModal,
    services
  } = useApp();

  const countTotal = useCountUp(24);
  const countSubmitted = useCountUp(applications.length || 5);
  const countInProgress = useCountUp(applications.filter(a => a.status === 'In Progress').length || 2);
  const countCompleted = useCountUp(applications.filter(a => a.status === 'Approved').length || 3);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Approved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Pending
          </span>
        );
    }
  };

  const getNotificationIcon = (notif) => {
    switch (notif.type) {
      case 'success':
        return <div className="p-2 rounded-full bg-emerald-500/15 text-emerald-400"><CheckCircle2 className="w-4 h-4" /></div>;
      case 'warning':
        return <div className="p-2 rounded-full bg-amber-500/15 text-amber-400"><AlertCircle className="w-4 h-4" /></div>;
      case 'auth':
        return <div className="p-2 rounded-full bg-purple-500/15 text-purple-400"><KeyRound className="w-4 h-4" /></div>;
      case 'system':
        return <div className="p-2 rounded-full bg-blue-500/15 text-blue-400"><Clock className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 rounded-full bg-blue-500/15 text-blue-400"><Info className="w-4 h-4" /></div>;
    }
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'apply') setActiveTab('services');
    else if (actionId === 'aadhaar') setIsAadhaarModalOpen(true);
    else if (actionId === 'docs') setActiveTab('apply');
    else if (actionId === 'consent') setActiveTab('consent');
    else if (actionId === 'tracking') setActiveTab('tracking');
  };

  return (
    <div className="space-y-6 pb-12 animate-precise-up">
      {/* 1. Monumental Dusk Hero Banner with Living Motion */}
      <section className="relative overflow-hidden rounded-2xl border border-orange-500/30 shadow-2xl bg-gradient-to-r from-[#170e0a] via-[#1d140e] to-[#0f121a]">
        {/* Animated Monumental Sunset Backdrop (Ken Burns breathing pan & zoom) */}
        <div 
          className="absolute inset-0 opacity-45 bg-cover bg-center pointer-events-none animate-ken-burns"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80')`,
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Diagonal Atmospheric Golden Sun Beam (Drifting) */}
        <div 
          className="absolute -top-24 -right-12 w-[450px] h-[350px] bg-gradient-to-b from-amber-400/25 via-orange-500/10 to-transparent pointer-events-none filter blur-2xl animate-beam-drift"
        />

        {/* Gradient Contrast Overlay so text stays super crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d13]/95 via-[#0e121a]/70 to-[#0a0d13]/40 pointer-events-none" />

        {/* Ambient warm glowing light orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none float-subtle" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-orange-400">Welcome to</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-semibold border border-orange-500/30">
                Official Unified Citizen Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Inter<span className="text-orange-500">Op</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              Your gateway to government services. <span className="text-orange-300 font-medium">Simple. Secure. Connected.</span>
            </p>
          </div>

          {/* Digital India Badge */}
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md self-start md:self-auto shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Digital India</p>
              <p className="text-[10px] text-slate-400">Power To Empower</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Metric Cards Row (4 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Services */}
        <div 
          onClick={() => setActiveTab('services')}
          className="scroll-reveal scroll-up-wave is-revealed stagger-1 interactive-card cursor-pointer p-5 rounded-xl bg-gradient-to-br from-[#241a15] to-[#161922] border border-orange-500/30 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all" />
          <p className="text-xs font-medium text-slate-400">Total Services</p>
          <p className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">{countTotal}</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-orange-400 group-hover:text-orange-300">
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Applications Submitted */}
        <div 
          onClick={() => setActiveTab('applications')}
          className="scroll-reveal scroll-up-wave is-revealed stagger-2 interactive-card cursor-pointer p-5 rounded-xl bg-gradient-to-br from-[#122220] to-[#161922] border border-teal-500/30 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all" />
          <p className="text-xs font-medium text-slate-400">Applications Submitted</p>
          <p className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">{countSubmitted}</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-teal-400 group-hover:text-teal-300">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => setActiveTab('tracking')}
          className="scroll-reveal scroll-up-wave is-revealed stagger-3 interactive-card cursor-pointer p-5 rounded-xl bg-gradient-to-br from-[#111f2e] to-[#161922] border border-sky-500/30 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all" />
          <p className="text-xs font-medium text-slate-400">In Progress</p>
          <p className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">{countInProgress}</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-sky-400 group-hover:text-sky-300">
            <span>View Tracking</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => setActiveTab('applications')}
          className="scroll-reveal scroll-up-wave is-revealed stagger-4 interactive-card cursor-pointer p-5 rounded-xl bg-gradient-to-br from-[#1d1629] to-[#161922] border border-purple-500/30 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
          <p className="text-xs font-medium text-slate-400">Completed</p>
          <p className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">{countCompleted}</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300">
            <span>View History</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </section>

      {/* 3. Quick Actions Row */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-wide">Quick Actions</h2>
          <button 
            onClick={() => setActiveTab('services')}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
          >
            <span>View All Services</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Apply for a Service */}
          <button
            onClick={() => handleQuickAction('apply')}
            className="scroll-reveal scroll-up-wave is-revealed stagger-1 interactive-card p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 text-left group flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">Apply for a Service</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Start a new application</p>
            </div>
          </button>

          {/* Link Aadhaar */}
          <button
            onClick={() => handleQuickAction('aadhaar')}
            className="scroll-reveal scroll-up-wave is-revealed stagger-2 interactive-card p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left group flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Link Aadhaar</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Verify your Aadhaar details</p>
            </div>
          </button>

          {/* Upload Documents */}
          <button
            onClick={() => handleQuickAction('docs')}
            className="scroll-reveal scroll-up-wave is-revealed stagger-3 interactive-card p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-left group flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">Upload Documents</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Submit required documents</p>
            </div>
          </button>

          {/* Consent Request */}
          <button
            onClick={() => handleQuickAction('consent')}
            className="scroll-reveal scroll-up-wave is-revealed stagger-4 interactive-card p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 text-left group flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Consent Request</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Manage your consents</p>
            </div>
          </button>

          {/* Track Application */}
          <button
            onClick={() => handleQuickAction('tracking')}
            className="scroll-reveal scroll-up-wave is-revealed stagger-5 interactive-card p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left group flex flex-col justify-between min-h-[110px] col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Track Application</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Check status of application</p>
            </div>
          </button>
        </div>
      </section>

      {/* 4. Two-Column Lower Section: Recent Applications & Recent Notifications */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Applications Table */}
        <div className="scroll-reveal scroll-up-wave is-revealed stagger-2 lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent Applications</h2>
            <button
              onClick={() => setActiveTab('applications')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 font-semibold">Service Name</th>
                  <th className="pb-3 font-semibold">Application ID</th>
                  <th className="pb-3 font-semibold">Current Step</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.slice(0, 5).map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => {
                      setSelectedApplicationDetails(app);
                      setActiveTab('tracking');
                    }}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 font-medium text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500 group-hover:text-orange-400" />
                      {app.serviceName}
                    </td>
                    <td className="py-3.5 font-mono text-slate-300">{app.id}</td>
                    <td className="py-3.5 text-slate-400">{app.currentStep}</td>
                    <td className="py-3.5">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 text-slate-400">{app.updatedAt || app.appliedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Notifications */}
        <div className="scroll-reveal scroll-up-wave is-revealed stagger-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Recent Notifications</h2>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <div 
                  key={n.id}
                  onClick={() => setActiveTab('notifications')}
                  className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  {getNotificationIcon(n)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-orange-300 transition-colors truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => setActiveTab('notifications')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              Open Notification Center →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
