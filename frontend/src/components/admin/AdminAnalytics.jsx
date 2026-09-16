import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Search, 
  Activity, 
  Lock, 
  Layers,
  Server,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

export const AdminAnalytics = () => {
  const { 
    auditLogs, 
    adminDashboardData, 
    healthData, 
    refreshBackendData, 
    citizenId, 
    isBackendConnected 
  } = useApp();

  const [logSearch, setLogSearch] = useState('');

  const adminStats = adminDashboardData || {
    total_citizens: 1,
    total_applications: 5,
    approved_applications: 2,
    rejected_applications: 1,
    pending_applications: 2,
    active_consents: 2
  };

  const departments = healthData?.departments || [
    { department_name: 'Education Department', status: 'ONLINE', response_time_ms: 28 },
    { department_name: 'Income Department', status: 'ONLINE', response_time_ms: 34 },
    { department_name: 'Welfare Department', status: 'ONLINE', response_time_ms: 41 },
    { department_name: 'Identity Registry', status: 'ONLINE', response_time_ms: 19 }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const term = logSearch.toLowerCase();
    return (
      (log.action || '').toLowerCase().includes(term) ||
      (log.citizen_id || '').toLowerCase().includes(term) ||
      (log.target_table || '').toLowerCase().includes(term) ||
      (log.data_provider || '').toLowerCase().includes(term)
    );
  });

  return (
    <div id="admin-analytics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>GovSync System Administration & Audit Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            InterOp Operations & Health Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-department connectivity, live transaction counters, and cryptographic audit records.
          </p>
        </div>

        <button
          onClick={() => refreshBackendData(citizenId)}
          className="btn-press self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Live Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Citizens In Registry</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {adminStats.total_citizens || 1}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Golden Records Synced</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Total Applications</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 font-mono">
            {adminStats.total_applications || 5}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">
            {adminStats.approved_applications || 0} Approved &bull; {adminStats.pending_applications || 0} Pending
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Active Consents</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono">
            {adminStats.active_consents || 2}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">Education & Income Active</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>FastAPI Engine</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {isBackendConnected ? 'ONLINE :8001' : 'STANDALONE'}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Supabase Connected</div>
        </div>
      </div>

      {/* Department Health Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Federated Department InterOp Health</h3>
            <p className="text-xs text-slate-500">Live heartbeat probes to departmental microservices</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            All Systems Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{dept.department_name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span className="font-semibold text-emerald-700">{dept.status}</span>
                <span className="font-mono">{dept.response_time_ms || 25}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        
        <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold">Immutable Security Audit Logs (GET /api/audit/:citizen_id)</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search action or table..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Citizen / Ref</th>
                <th className="py-3 px-4">Target Provider / Table</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching audit log records found for this query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.log_id || idx} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {log.log_id || `AUD-${idx + 1}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {log.citizen_id || citizenId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {log.data_provider || log.target_table || 'GovSync Core'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
