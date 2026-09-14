import React from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, CheckCircle2, XCircle, Clock, ShieldCheck, Lock, AlertTriangle, Eye } from 'lucide-react';

export const ConsentHub = () => {
  const { consentRequests, handleConsentAction } = useApp();

  return (
    <div id="consent-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <Share2 className="w-4 h-4" />
          <span>Cross-Department Data Sovereignty</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Citizen Consent Management Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Under InterOp security architecture, government departments cannot access your identity records without your explicit approval.
        </p>
      </div>

      {/* Security Banner */}
      <div className="bg-emerald-900/90 text-white rounded-3xl p-6 shadow-md border border-emerald-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Full Citizen Control & Zero-Trust Access</h3>
            <p className="text-xs text-emerald-200">
              Every data access attempt by external departments is cryptographically logged in the InterOp immutable audit trail.
            </p>
          </div>
        </div>
      </div>

      {/* Consent Requests List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Active Consent Requests</h3>

        <div className="space-y-4">
          {consentRequests.map((req) => (
            <div 
              key={req.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {req.id}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{req.requestingDept}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{req.purpose}</h4>

                {/* Requested Data Tags */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Requested Data Scope:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {req.dataRequested.map((item, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                        &bull; {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-4">
                  <span>Requested: {req.requestedDate}</span>
                  <span>Expires: {req.expiresAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full md:w-auto shrink-0 flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleConsentAction(req.id, 'Approved')}
                      className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Grant Consent</span>
                    </button>
                    <button
                      onClick={() => handleConsentAction(req.id, 'Denied')}
                      className="flex-1 md:flex-initial bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Deny</span>
                    </button>
                  </>
                ) : (
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {req.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>Consent {req.status}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
