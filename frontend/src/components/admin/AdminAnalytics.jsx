import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, ShieldCheck, Cpu, Terminal, Search, Activity, Lock, Layers } from 'lucide-react';

export const AdminAnalytics = () => {
  const { auditLogs } = useApp();
  const [logSearch, setLogSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.resource.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div id="admin-analytics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span>System Administration & Audit Ledger</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Analytics & Audit Logs
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time metrics, system performance, AI model evaluation, and cross-department security audit trail.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Active Citizens</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">1,482,910</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+12.4% this month</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Avg Processing Time</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">1.8 Days</div>
          <div className="text-[11px] text-blue-600 font-semibold">70% faster than manual</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>ML Model Precision</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">99.4%</div>
          <div className="text-[11px] text-amber-600 font-semibold">OCR & Face Vector Model</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Audit Ledger Status</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">100% Valid</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Zero-Trust Encrypted</div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        
        <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold">Immutable Security Audit Logs</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search log action or IP..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor / System</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4 text-slate-800 font-sans font-bold">{log.actor}</td>
                  <td className="py-3 px-4 text-blue-600 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-600">{log.resource}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Showing all recent system security audit logs
        </div>

      </div>

    </div>
  );
};
