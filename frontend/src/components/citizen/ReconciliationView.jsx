import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitCompare, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Database, 
  Building2, 
  RefreshCw, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const ReconciliationView = () => {
  const { 
    citizenId, 
    reconciliationData, 
    refreshBackendData, 
    showToast 
  } = useApp();

  const handleResolve = () => {
    showToast('Golden record synchronization broadcasted to Welfare Department', 'success', 'Reconciled');
  };

  const report = reconciliationData || {
    citizen_id: citizenId,
    status: 'DATA_MISMATCH_DETECTED',
    conflicts: [
      {
        field: 'Date of Birth (DOB)',
        golden_value: '2007-05-04',
        golden_source: 'National Golden Citizen Registry (citizens)',
        conflicting_value: '2007-04-05',
        conflicting_source: 'State Welfare Department (welfare_applications)',
        severity: 'HIGH_PRIORITY_CONFLICT',
        description: 'Transposed day/month conflict detected between primary registry and legacy departmental silo.'
      }
    ],
    recommendation: 'Update Welfare Department record to match Golden Record authoritative timestamp.'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="light-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-white border border-amber-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300 uppercase tracking-wider">
              Cross-Department Data Reconciliation
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 animate-pulse">
              1 Conflict Detected
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Integrity & Conflict Resolution
          </h1>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl font-normal">
            Automated reconciliation engine detects divergent citizen records between departmental silos and harmonizes them with the verified Golden Record.
          </p>
        </div>

        <button
          onClick={() => {
            refreshBackendData(citizenId);
            showToast('Reconciliation engine scan complete', 'info');
          }}
          className="btn-press self-start md:self-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
          <span>Re-scan Records</span>
        </button>
      </div>

      {/* Main Conflict Detail Card */}
      <div className="light-card rounded-2xl p-6 border-2 border-amber-300/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                DOB Divergence Identified (Citizen: {citizenId})
              </h2>
              <p className="text-xs text-slate-500">
                Rule Engine Trigger: <span className="font-mono text-amber-800 font-bold">RECON-RULE-DOB-001</span>
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Pending Harmonization
          </span>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Golden Record (Authoritative) */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Golden Record (Authoritative)
              </span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Primary Truth
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200/80 space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Date of Birth (DOB)</span>
              <p className="text-2xl font-black font-mono text-emerald-700">2007-05-04</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source: National Citizen Registry (citizens)</span>
              </div>
            </div>
          </div>

          {/* Departmental Record (Conflicting) */}
          <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Conflicting Department Record
              </span>
              <span className="text-[10px] bg-rose-200/70 text-rose-900 font-bold px-2 py-0.5 rounded-full">
                Legacy Silo
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200/80 space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Date of Birth (DOB)</span>
              <p className="text-2xl font-black font-mono text-rose-700">2007-04-05</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <Building2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Source: State Welfare Department (welfare_applications)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Resolution Recommendation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">Automated AI Resolution Action</span>
            <p className="text-xs text-slate-600 max-w-xl">
              Sync Welfare Department application date of birth to match Golden Record date <span className="font-mono font-bold text-emerald-700">2007-05-04</span>. Creates tamper-evident audit record in the system ledger.
            </p>
          </div>

          <button
            onClick={handleResolve}
            className="btn-press shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Harmonize Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
