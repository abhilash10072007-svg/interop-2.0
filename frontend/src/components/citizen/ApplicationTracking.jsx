import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationTracking = () => {
  const { applications, selectedApplicationDetails, setSelectedApplicationDetails } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeApp, setActiveApp] = useState(selectedApplicationDetails || null);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Approved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-precise-up">
      {/* Title & Filters */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white">Application Tracking</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track the status of your submitted applications in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by application ID or service name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="All Status">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Applied On</th>
                <th className="py-3.5 px-4">Current Step</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApps.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-4 px-4 font-mono font-medium text-slate-300">
                    {app.id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-white">
                    {app.serviceName}
                  </td>
                  <td className="py-4 px-4 text-slate-400">
                    {app.appliedOn}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {app.currentStep}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setActiveApp(app)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600/15 text-orange-400 hover:bg-orange-600 hover:text-white text-xs font-semibold transition-all"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer Modal */}
      {activeApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-modal-spring">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider font-mono">
                  {activeApp.id}
                </span>
                <h3 className="text-lg font-bold text-white">{activeApp.serviceName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeApp.department}</p>
              </div>
              <button
                onClick={() => setActiveApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Application Progression</span>
                {getStatusBadge(activeApp.status)}
              </div>

              <div className="space-y-4 relative pl-4 border-l-2 border-slate-800">
                {activeApp.steps?.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={idx} className="relative pl-4">
                      {/* Status Dot */}
                      <span className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 ${
                        isDone 
                          ? 'bg-emerald-500 border-slate-900 text-white' 
                          : isCurrent 
                          ? 'bg-orange-500 border-slate-900 animate-pulse' 
                          : 'bg-slate-800 border-slate-700'
                      }`} />

                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isDone ? 'text-slate-200' : isCurrent ? 'text-orange-400' : 'text-slate-500'}`}>
                          {step.name}
                        </p>
                        <span className="text-[10px] text-slate-400">{step.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isDone ? 'Completed successfully' : isCurrent ? 'Currently in process with reviewing authority' : 'Awaiting previous step completion'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              {activeApp.status === 'Approved' && (
                <button
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-orange-600/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Digital Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
