import React from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Coins, 
  GraduationCap, 
  History, 
  CheckCircle2, 
  ChevronRight,
  Lock,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConsentManagement = () => {
  const { consents, handleToggleConsent, consentHistory } = useApp();

  const getConsentIcon = (name) => {
    if (name.includes('Aadhaar')) return <Fingerprint className="w-5 h-5 text-purple-400" />;
    if (name.includes('Income')) return <Coins className="w-5 h-5 text-emerald-400" />;
    return <GraduationCap className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-precise-up">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <h1 className="text-xl font-bold text-white">Consent Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your data consent to share with government departments for faster and smoother services.
        </p>
      </div>

      {/* Active Consents Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Active Consents</h2>
          <button className="text-xs text-orange-400 hover:text-orange-300 font-semibold">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {consents.map((consent) => {
            return (
              <div 
                key={consent.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex-shrink-0">
                    {getConsentIcon(consent.name)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{consent.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{consent.purpose}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      <span>Valid till {consent.validTill}</span>
                      <span className="text-slate-600">•</span>
                      <span>{consent.department}</span>
                    </div>
                  </div>
                </div>

                {/* Modern Toggle Switch */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <span className={`text-[11px] font-semibold ${consent.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {consent.enabled ? 'Active' : 'Revoked'}
                  </span>
                  <button
                    onClick={() => handleToggleConsent(consent.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      consent.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white">Consent History</h2>
          </div>
          <button className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
            <span>View History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 font-semibold">Service</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {consentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-medium text-white">{item.service}</td>
                  <td className="py-3 text-slate-400">{item.department}</td>
                  <td className="py-3 text-slate-400">{item.date}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
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
