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
  TrendingUp,
  FileText,
  KeyRound,
  BadgeCheck,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';


// ============================================================
// COUNT-UP HOOK
// ============================================================

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frameId;

    const safeTarget =
      Number.isFinite(Number(target))
        ? Number(target)
        : 0;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const ease =
        progress === 1
          ? 1
          : 1 - Math.pow(2, -10 * progress);

      setCount(
        Math.floor(ease * safeTarget)
      );

      if (progress < 1) {
        frameId =
          requestAnimationFrame(animate);
      } else {
        setCount(safeTarget);
      }
    };

    frameId =
      requestAnimationFrame(animate);

    return () =>
      cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}


// ============================================================
// DASHBOARD
// ============================================================

export const Dashboard = () => {
  const {
    applications,
    notifications,
    services,
    consents,

    setActiveTab,
    setSelectedApplicationDetails,
    setIsAadhaarModalOpen,
  } = useApp();


  // ============================================================
  // SAFE LIVE DATA
  // ============================================================

  const safeApplications =
    Array.isArray(applications)
      ? applications
      : [];

  const safeNotifications =
    Array.isArray(notifications)
      ? notifications
      : [];

  const safeServices =
    Array.isArray(services)
      ? services
      : [];

  const safeConsents =
    Array.isArray(consents)
      ? consents
      : [];


  // ============================================================
  // LIVE COUNTS
  // ============================================================

  const totalServices =
    safeServices.length;

  const totalApplications =
    safeApplications.length;

  const applicationsInProgress =
    safeApplications.filter(
      (app) =>
        String(
          app.status || ''
        ).toLowerCase() ===
        'in progress'
    ).length;

  const completedApplications =
    safeApplications.filter(
      (app) =>
        String(
          app.status || ''
        ).toLowerCase() ===
        'approved'
    ).length;

  const digitalVaultCount =
    safeConsents.length;


  // ============================================================
  // COUNT-UP ANIMATION
  // ============================================================

  const countTotal =
    useCountUp(totalServices);

  const countSubmitted =
    useCountUp(totalApplications);

  const countInProgress =
    useCountUp(
      applicationsInProgress
    );

  const countCompleted =
    useCountUp(
      completedApplications
    );

  const countVault =
    useCountUp(
      digitalVaultCount
    );


  // ============================================================
  // STATUS BADGE
  // ============================================================

  const getStatusBadge = (
    status
  ) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );

      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            In Progress
          </span>
        );

      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Rejected
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Pending
          </span>
        );
    }
  };


  // ============================================================
  // NOTIFICATION ICON
  // ============================================================

  const getNotificationIcon = (
    notification
  ) => {
    switch (
      notification.type
    ) {
      case 'success':
        return (
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );

      case 'warning':
        return (
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
            <AlertCircle className="w-4 h-4" />
          </div>
        );

      case 'auth':
        return (
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-2xs">
            <KeyRound className="w-4 h-4" />
          </div>
        );

      case 'system':
      default:
        return (
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
        );
    }
  };


  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  const handleQuickAction = (
    actionId
  ) => {
    if (actionId === 'apply') {
      setActiveTab('services');
    }

    else if (
      actionId === 'aadhaar'
    ) {
      setIsAadhaarModalOpen(true);
    }

    else if (
      actionId === 'docs'
    ) {
      setActiveTab('apply');
    }

    else if (
      actionId === 'consent'
    ) {
      setActiveTab('consent');
    }

    else if (
      actionId === 'tracking'
    ) {
      setActiveTab('tracking');
    }
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6 pb-12">

      {/* ====================================================== */}
      {/* HERO SECTION */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-orange-200/90 shadow-md bg-gradient-to-r from-orange-50/95 via-amber-50/60 to-white p-6 md:p-8">

        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none animate-living-glide"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition:
              'center 38%',
          }}
        />

        <div className="absolute -top-20 -right-10 w-96 h-80 bg-gradient-to-b from-orange-300/20 via-amber-200/10 to-transparent pointer-events-none filter blur-2xl animate-beam-drift" />

        <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none float-subtle" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="space-y-2.5 max-w-2xl">

            <div className="flex items-center gap-2">

              <span className="text-[11px] uppercase font-extrabold tracking-widest text-orange-600">
                Official Portal
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200 shadow-2xs">
                Active Session
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Inter
              <span className="text-orange-500">
                Op
              </span>{' '}
              Citizen Gateway
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Unified, zero-repetition government services.
              <span className="text-orange-600 font-semibold">
                {' '}
                Simple. Secure. Interoperable.
              </span>
            </p>

          </div>


          {/* DIGITAL INDIA */}

          <div className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 border border-orange-200/80 backdrop-blur-md self-start md:self-auto shadow-sm">

            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 tracking-wide">
                Digital India
              </p>

              <p className="text-[11px] text-slate-500 font-medium">
                Power To Empower
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* LIVE METRIC CARDS */}
      {/* ====================================================== */}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* TOTAL SERVICES */}

        <div
          onClick={() =>
            setActiveTab('services')
          }
          className="light-card btn-press p-5 rounded-2xl cursor-pointer relative overflow-hidden group animate-converge-grid card-stagger-1 border-t-4 border-t-orange-500"
        >

          <div className="flex items-center justify-between">

            <p className="text-xs font-bold text-slate-500">
              Total Services
            </p>

            <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <TrendingUp className="w-4 h-4" />
            </span>

          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tracking-tight">
            {countTotal}
          </p>

          <div className="mt-3 flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-700">

            <span>
              Explore Catalog
            </span>

            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />

          </div>

        </div>


        {/* APPLICATIONS */}

        <div
          onClick={() =>
            setActiveTab('applications')
          }
          className="light-card btn-press p-5 rounded-2xl cursor-pointer relative overflow-hidden group animate-converge-grid card-stagger-2 border-t-4 border-t-emerald-500"
        >

          <div className="flex items-center justify-between">

            <p className="text-xs font-bold text-slate-500">
              Submitted
            </p>

            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileText className="w-4 h-4" />
            </span>

          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tracking-tight">
            {countSubmitted}
          </p>

          <div className="mt-3 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700">

            <span>
              View All
            </span>

            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />

          </div>

        </div>


        {/* IN PROGRESS */}

        <div
          onClick={() =>
            setActiveTab('tracking')
          }
          className="light-card btn-press p-5 rounded-2xl cursor-pointer relative overflow-hidden group animate-converge-grid card-stagger-3 border-t-4 border-t-sky-500"
        >

          <div className="flex items-center justify-between">

            <p className="text-xs font-bold text-slate-500">
              In Progress
            </p>

            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Clock className="w-4 h-4" />
            </span>

          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tracking-tight">
            {countInProgress}
          </p>

          <div className="mt-3 flex items-center text-xs font-bold text-sky-600 group-hover:text-sky-700">

            <span>
              Live Tracking
            </span>

            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />

          </div>

        </div>


        {/* COMPLETED */}

        <div
          onClick={() =>
            setActiveTab('applications')
          }
          className="light-card btn-press p-5 rounded-2xl cursor-pointer relative overflow-hidden group animate-converge-grid card-stagger-4 border-t-4 border-t-purple-500"
        >

          <div className="flex items-center justify-between">

            <p className="text-xs font-bold text-slate-500">
              Delivered
            </p>

            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <CheckCircle2 className="w-4 h-4" />
            </span>

          </div>

          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tracking-tight">
            {countCompleted}
          </p>

          <div className="mt-3 flex items-center text-xs font-bold text-purple-600 group-hover:text-purple-700">

            <span>
              Get Certificates
            </span>

            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />

          </div>

        </div>


        {/* DIGITAL VAULT */}

        <div
          onClick={() =>
            setActiveTab('consent')
          }
          className="light-card btn-press p-5 rounded-2xl cursor-pointer relative overflow-hidden group animate-converge-grid card-stagger-5 border-t-4 border-t-indigo-600 bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/20"
        >

          <div className="flex items-center justify-between">

            <p className="text-xs font-bold text-indigo-900">
              Digital Vault
            </p>

            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200">
              <BadgeCheck className="w-4 h-4" />
            </span>

          </div>

          <p className="text-3xl font-extrabold text-indigo-950 mt-2 font-mono tracking-tight">

            {countVault}

            <span className="text-sm font-sans font-bold text-indigo-600 ml-1">
              Consents
            </span>

          </p>

          <div className="mt-3 flex items-center text-xs font-bold text-indigo-700 group-hover:text-indigo-800">

            <span>
              Verified eKYC
            </span>

            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* QUICK ACTIONS */}
      {/* ====================================================== */}

      <section className="space-y-3">

        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Quick Citizen Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">

          {/* APPLY */}

          <button
            onClick={() =>
              handleQuickAction('apply')
            }
            className="light-card btn-press p-4 rounded-2xl text-center group flex flex-col items-center justify-center gap-2.5 animate-converge-grid card-stagger-1 cursor-pointer"
          >

            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/80 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-2xs">
              <FilePlus className="w-5 h-5" />
            </div>

            <span className="text-xs font-bold text-slate-800">
              Apply Services
            </span>

          </button>


          {/* AADHAAR */}

          <button
            onClick={() =>
              handleQuickAction(
                'aadhaar'
              )
            }
            className="light-card btn-press p-4 rounded-2xl text-center group flex flex-col items-center justify-center gap-2.5 animate-converge-grid card-stagger-2 cursor-pointer"
          >

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-2xs">
              <Fingerprint className="w-5 h-5" />
            </div>

            <span className="text-xs font-bold text-slate-800">
              Link Aadhaar
            </span>

          </button>


          {/* DIGILOCKER */}

          <button
            onClick={() =>
              handleQuickAction(
                'docs'
              )
            }
            className="light-card btn-press p-4 rounded-2xl text-center group flex flex-col items-center justify-center gap-2.5 animate-converge-grid card-stagger-3 cursor-pointer"
          >

            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200/80 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-2xs">
              <UploadCloud className="w-5 h-5" />
            </div>

            <span className="text-xs font-bold text-slate-800">
              DigiLocker Sync
            </span>

          </button>


          {/* CONSENT */}

          <button
            onClick={() =>
              handleQuickAction(
                'consent'
              )
            }
            className="light-card btn-press p-4 rounded-2xl text-center group flex flex-col items-center justify-center gap-2.5 animate-converge-grid card-stagger-4 cursor-pointer"
          >

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <span className="text-xs font-bold text-slate-800">
              Consent Hub
            </span>

          </button>


          {/* TRACKING */}

          <button
            onClick={() =>
              handleQuickAction(
                'tracking'
              )
            }
            className="light-card btn-press p-4 rounded-2xl text-center group flex flex-col items-center justify-center gap-2.5 animate-converge-grid card-stagger-5 cursor-pointer col-span-2 sm:col-span-1"
          >

            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/80 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-2xs">
              <Search className="w-5 h-5" />
            </div>

            <span className="text-xs font-bold text-slate-800">
              Track Status
            </span>

          </button>

        </div>

      </section>


      {/* ====================================================== */}
      {/* APPLICATIONS + NOTIFICATIONS */}
      {/* ====================================================== */}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ==================================================== */}
        {/* RECENT APPLICATIONS */}
        {/* ==================================================== */}

        <div className="lg:col-span-2 light-card rounded-2xl p-6 space-y-4 animate-converge-grid card-stagger-2">

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Recent Applications
              </h2>

              <p className="text-xs text-slate-500">
                Live synchronization with Welfare Department & FastAPI
              </p>

            </div>

            <button
              onClick={() =>
                setActiveTab(
                  'applications'
                )
              }
              className="btn-press text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100/70 border border-orange-200/70 shadow-2xs"
            >

              <span>
                View All
              </span>

              <ArrowRight className="w-3.5 h-3.5" />

            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead>

                <tr className="text-slate-400 font-bold border-b border-slate-100">

                  <th className="pb-3 pl-1">
                    Application ID
                  </th>

                  <th className="pb-3">
                    Service Scheme
                  </th>

                  <th className="pb-3">
                    Submitted
                  </th>

                  <th className="pb-3">
                    Status
                  </th>

                  <th className="pb-3 text-right pr-1">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {safeApplications
                  .slice(0, 4)
                  .map((app) => (

                    <tr
                      key={app.id}
                      className="hover:bg-orange-50/40 transition-colors"
                    >

                      <td className="py-3.5 pl-1 font-mono font-bold text-slate-900">
                        {app.id}
                      </td>

                      <td className="py-3.5 font-bold text-slate-800">
                        {app.serviceName ||
                          'Government Scheme'}
                      </td>

                      <td className="py-3.5 text-slate-500 font-medium">
                        {app.appliedOn ||
                          '--'}
                      </td>

                      <td className="py-3.5">
                        {getStatusBadge(
                          app.status
                        )}
                      </td>

                      <td className="py-3.5 text-right pr-1">

                        <button
                          onClick={() => {
                            setSelectedApplicationDetails(
                              app
                            );

                            setActiveTab(
                              'tracking'
                            );
                          }}
                          className="btn-press px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-bold border border-slate-200/80 transition-all text-[11px] shadow-2xs"
                        >
                          Track
                        </button>

                      </td>

                    </tr>

                  ))}


                {/* EMPTY STATE */}

                {safeApplications.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-10 text-center text-slate-400"
                    >

                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />

                      <p className="text-xs font-semibold">
                        No applications found
                      </p>

                      <p className="text-[11px] mt-1">
                        Your live applications will appear here.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ==================================================== */}
        {/* NOTIFICATIONS */}
        {/* ==================================================== */}

        <div className="light-card rounded-2xl p-6 space-y-4 animate-converge-grid card-stagger-3">

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">

            <h2 className="text-base font-bold text-slate-900">
              Recent Notices
            </h2>

            <button
              onClick={() =>
                setActiveTab(
                  'notifications'
                )
              }
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              See All
            </button>

          </div>


          <div className="space-y-3">

            {safeNotifications
              .slice(0, 3)
              .map((notification) => (

                <div
                  key={notification.id}
                  onClick={() =>
                    setActiveTab(
                      'notifications'
                    )
                  }
                  className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-orange-50/50 border border-slate-200/70 hover:border-orange-200/80 transition-all cursor-pointer flex gap-3 btn-press shadow-2xs"
                >

                  <div className="shrink-0 mt-0.5">

                    {getNotificationIcon(
                      notification
                    )}

                  </div>


                  <div className="space-y-0.5 min-w-0">

                    <div className="flex items-center justify-between">

                      <p className="text-xs font-bold text-slate-800 truncate">
                        {notification.title ||
                          'Notification'}
                      </p>

                      <span className="text-[10px] text-slate-400 shrink-0 ml-1 font-medium">
                        {notification.time ||
                          'Recent'}
                      </span>

                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {notification.message ||
                        'System update'}
                    </p>

                  </div>

                </div>

              ))}


            {/* EMPTY NOTIFICATIONS */}

            {safeNotifications.length ===
              0 && (

              <div className="py-8 text-center">

                <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />

                <p className="text-xs font-semibold text-slate-500">
                  No recent notices
                </p>

              </div>

            )}

          </div>


          {/* INTEROPERABILITY INFO */}

          <div className="p-3.5 rounded-xl bg-orange-50/90 border border-orange-200/90 text-orange-950 flex items-start gap-2.5 shadow-2xs">

            <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />

            <div className="text-[11px] leading-relaxed">

              <span className="font-bold">
                Interoperability Active:
              </span>{' '}

              Verified credentials sync automatically between government departments through the InterOp platform.

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;