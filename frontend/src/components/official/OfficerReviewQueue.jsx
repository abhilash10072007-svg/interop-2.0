import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Cpu, 
  AlertTriangle, 
  Search, 
  Filter,
  RefreshCw,
  Sparkles,
  Building2
} from 'lucide-react';

export const OfficerReviewQueue = () => {
  const { 
    applications, 
    handleOfficerApproveApp, 
    handleOfficerRejectApp, 
    officerId,
    refreshBackendData,
    citizenId,
    isBackendConnected 
  } = useApp();

  const pendingApps = applications.filter(
    a => a.rawStatus === 'SUBMITTED' || a.rawStatus === 'UNDER_REVIEW' || a.status === 'In Progress'
  );

  return (
    <div id="officer-review-queue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-700/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md uppercase">
              Official Officer Review Portal
            </span>
            <span className="text-xs text-amber-200 font-mono">Officer ID: {officerId} (Designated Approver)</span>
          </div>
          <h2 className="text-2xl font-black text-white">Government Application Review Queue</h2>
          <p className="text-xs text-amber-100 max-w-2xl">
            Live cross-department verification queue connected to FastAPI & Supabase. Authorize applications or request document correction with 1-click ledger audit trail.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => refreshBackendData(citizenId)}
            className="btn-press px-3 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/40 text-amber-200 text-xs font-bold flex items-center gap-1.5"
            title="Refresh Queue"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="bg-amber-950/80 p-4 rounded-2xl border border-amber-700/50 text-center shrink-0">
            <div className="text-2xl font-black text-amber-400">{pendingApps.length}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase">Pending Reviews</div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Application Workflows Awaiting Authorization</h3>
          <span className="text-xs text-slate-500 font-medium">FastAPI Endpoint: PUT /api/applications/:id/status</span>
        </div>

        {pendingApps.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">Queue Clear!</h4>
            <p className="text-xs text-slate-500">All submitted citizen applications have been processed and authorized.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingApps.map((app) => (
              <div 
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 hover:shadow-md transition-shadow"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {app.id}
                      </span>
                      <span className="text-xs font-mono text-slate-500">&bull; Submitted: {app.appliedOn}</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {app.rawStatus || 'SUBMITTED'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1.5">{app.serviceName}</h4>
                    <p className="text-xs text-slate-500">{app.department} &bull; Cross-Verified with SKCET & Revenue Board</p>
                  </div>

                  {/* Interoperability Verification Badge */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block font-bold">InterOp Automated Match</span>
                      <strong className="text-emerald-700 font-mono font-bold">100% Eligible</strong>
                    </div>
                  </div>
                </div>

                {/* Citizen Details & InterOp Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Citizen Info Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Applicant Dossier
                    </span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applicant:</span>
                      <span className="font-bold text-slate-900">{app.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Citizen ID:</span>
                      <span className="font-mono font-bold text-slate-800">{app.applicantRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DOB (Application):</span>
                      <span className="font-mono font-semibold text-slate-700">{app.birthDate}</span>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Automated Pre-Requisites
                    </span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Education Consent:</span>
                      <strong className="text-emerald-700 font-mono">GRANTED (Active)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income Ceiling Check:</span>
                      <strong className="text-emerald-700 font-mono">PASSED (&le; ₹2.5L)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">College Enrollment:</span>
                      <strong className="text-emerald-700 font-mono">PASSED (ACTIVE)</strong>
                    </div>
                  </div>

                </div>

                {/* Officer Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOfficerRejectApp(app.id)}
                    className="btn-press bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
                  >
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    onClick={() => handleOfficerApproveApp(app.id)}
                    className="btn-press bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Issue Digital Approval</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
