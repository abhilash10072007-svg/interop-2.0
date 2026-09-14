import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, FileText, Cpu, AlertTriangle, Search, Filter } from 'lucide-react';

export const OfficerReviewQueue = () => {
  const { applications, handleOfficerApproveApp, handleOfficerRejectApp } = useApp();

  const pendingApps = applications.filter(a => a.status === 'In Progress' || a.status === 'Submitted');

  return (
    <div id="officer-review-queue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-700/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md uppercase">Official Officer Mode</span>
            <span className="text-xs text-amber-200">Department Reviewer ID: OFF-RTO-9942</span>
          </div>
          <h2 className="text-2xl font-black text-white">Government Application Queue</h2>
          <p className="text-xs text-amber-100 max-w-2xl">
            Review incoming citizen applications with real-time AI ML Risk Scoring, automated OCR face-match validation, and 1-click digital signature authorization.
          </p>
        </div>

        <div className="bg-amber-950/80 p-4 rounded-2xl border border-amber-700/50 text-center shrink-0">
          <div className="text-2xl font-black text-amber-400">{pendingApps.length}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase">Pending Reviews</div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-slate-900">Application Workflows Pending Approval</h3>

        {pendingApps.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">Queue Clear!</h4>
            <p className="text-xs text-slate-500">All submitted citizen applications have been processed.</p>
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
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {app.id}
                      </span>
                      <span className="text-xs text-slate-400">&bull; Submitted: {app.submittedDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{app.serviceName}</h4>
                    <p className="text-xs text-slate-500">{app.department}</p>
                  </div>

                  {/* AI Risk Score Badge */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block">AI ML Risk Scoring</span>
                      <strong className="text-emerald-700 font-mono font-bold">{app.riskScore}</strong>
                    </div>
                  </div>
                </div>

                {/* Citizen Details & OCR Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Citizen Info Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Citizen Credentials
                    </span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applicant:</span>
                      <span className="font-bold text-slate-900">{app.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Aadhaar Token:</span>
                      <span className="font-mono font-bold text-slate-800">{app.aadhaarNumber}</span>
                    </div>
                  </div>

                  {/* ML OCR Vector Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      ML OCR & Biometric Vectors
                    </span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name Match:</span>
                      <strong className="text-emerald-700 font-mono">{app.ocrDetails.nameMatch}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Face Vector Similarity:</span>
                      <strong className="text-emerald-700 font-mono">{app.ocrDetails.faceMatch}</strong>
                    </div>
                  </div>

                </div>

                {/* Officer Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOfficerRejectApp(app.id)}
                    className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Request Document Correction</span>
                  </button>

                  <button
                    onClick={() => handleOfficerApproveApp(app.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Issue Digital Certificate</span>
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
