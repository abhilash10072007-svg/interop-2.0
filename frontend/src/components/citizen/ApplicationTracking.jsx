import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationTracking = () => {
  const { applications, selectedApplicationDetails } = useApp();

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Filters */}
      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Application Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track the status of your submitted applications across state departments in real-time.
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
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
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
      <div className="light-card rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Applied On</th>
                <th className="py-3.5 px-4">Current Step</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-orange-50/40 transition-colors group"
                >
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    {app.id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {app.serviceName}
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    {app.appliedOn}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {app.currentStep}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setActiveApp(app)}
                      className="btn-press inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 text-xs font-bold transition-all shadow-2xs"
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-modal-spring">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider font-mono">
                  {activeApp.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{activeApp.serviceName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeApp.department}</p>
              </div>
              <button
                onClick={() => setActiveApp(null)}
                className="btn-press p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-600">Application Progression</span>
                {getStatusBadge(activeApp.status)}
              </div>

              <div className="space-y-5 relative pl-4 border-l-2 border-slate-200 ml-2">
                {activeApp.steps?.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={idx} className="relative pl-5">
                      {/* Status Dot */}
                      <span className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${
                        isDone 
                          ? 'bg-emerald-500 border-white text-white shadow-xs' 
                          : isCurrent 
                          ? 'bg-orange-500 border-white ring-2 ring-orange-200 animate-pulse' 
                          : 'bg-slate-200 border-white'
                      }`} />

                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isDone ? 'text-slate-800' : isCurrent ? 'text-orange-600' : 'text-slate-400'}`}>
                          {step.name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">{step.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {isDone ? 'Completed successfully' : isCurrent ? 'Currently in process with reviewing authority' : 'Awaiting previous step completion'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveApp(null)}
                className="btn-press px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-xs font-semibold text-slate-700"
              >
                Close
              </button>
              {activeApp.status === 'Approved' && (
                <button
                  className="btn-press px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-orange-500/20"
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
