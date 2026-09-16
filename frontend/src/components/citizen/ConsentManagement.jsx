import React from 'react';
import { 
  Fingerprint, 
  Coins, 
  GraduationCap, 
  History, 
  CheckCircle2, 
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConsentManagement = () => {
  const { consents, handleToggleConsent, consentHistory } = useApp();

  const getConsentIcon = (name) => {
    if (name.includes('Aadhaar')) return <Fingerprint className="w-5 h-5 text-purple-600" />;
    if (name.includes('Income')) return <Coins className="w-5 h-5 text-emerald-600" />;
    return <GraduationCap className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="light-card p-6 rounded-2xl shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Consent Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your data consent to share with government departments for faster and smoother services.
        </p>
      </div>

      {/* Active Consents Card */}
      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Active Consents</h2>
          <span className="text-xs text-slate-400 font-semibold">
            {consents.filter(c => c.enabled).length} Active
          </span>
        </div>

        <div className="space-y-3">
          {consents.map((consent) => {
            return (
              <div 
                key={consent.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-orange-50/30"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 shrink-0 shadow-2xs">
                    {getConsentIcon(consent.name)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{consent.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{consent.purpose}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span>Valid till {consent.validTill}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">{consent.department}</span>
                    </div>
                  </div>
                </div>

                {/* Modern Toggle Switch */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <span className={`text-[11px] font-bold ${consent.enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {consent.enabled ? 'Active' : 'Revoked'}
                  </span>
                  <button
                    onClick={() => handleToggleConsent(consent.id)}
                    className={`btn-press relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                      consent.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                        consent.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consent History Table */}
      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-bold text-slate-900">Consent History & Audit Log</h2>
          </div>
          <span className="text-xs text-orange-600 font-bold flex items-center gap-1">
            <span>Immutable Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 px-2 font-bold">Action</th>
                <th className="pb-3 px-2 font-bold">Department / Agency</th>
                <th className="pb-3 px-2 font-bold">Date & Time</th>
                <th className="pb-3 px-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-2 font-semibold text-slate-800">{item.action}</td>
                  <td className="py-3 px-2 text-slate-600">{item.department}</td>
                  <td className="py-3 px-2 text-slate-400">{item.date}</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
