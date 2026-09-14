import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, Building2, AlertCircle } from 'lucide-react';

export const SchemeLinking = () => {
  const { schemes, user, setIsAadhaarModalOpen, showToast } = useApp();

  return (
    <div id="scheme-linking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <CreditCard className="w-4 h-4" />
          <span>Direct Benefit Transfer & Welfare Linking</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Government Schemes & Aadhaar Account Linking
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Connect your Aadhaar & bank account to receive direct financial subsidies, pensions, and medical benefits directly.
        </p>
      </div>

      {/* Linked Identity Card Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md uppercase">eKYC Vault</span>
            <span className="text-xs font-bold text-blue-200">Aadhaar Token: {user.aadhaarNumber}</span>
          </div>
          <h3 className="text-xl font-bold text-white">Linked Citizen Bank Account</h3>
          <p className="text-xs text-blue-200">
            Primary DBT Disbursement Account: <strong className="text-white">State Bank of India (A/C: •••• 4091)</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAadhaarModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Manage Identity Links</span>
        </button>
      </div>

      {/* Schemes Cards Grid (Matching Image 1 Scheme Linking cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((sch) => (
          <div 
            key={sch.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {sch.dept}
                </span>
                <h3 className="text-base font-bold text-slate-900">{sch.name}</h3>
              </div>

              {sch.status === 'Linked' ? (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Linked
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Consent Pending
                </span>
              )}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-2 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Benefit Details:</span>
                <span className="font-bold text-slate-800">{sch.lastPayout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Linked Account:</span>
                <span className="font-bold text-slate-900">{sch.accountNo}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Auto DBT eKYC Verified
              </span>

              <button
                onClick={() => showToast(`Updated link status for ${sch.name}`, 'info')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
