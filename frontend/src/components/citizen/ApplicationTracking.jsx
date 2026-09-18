import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronRight,
  X,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

const ApplicationTracking = () => {
  const {
    applications = [],
    selectedApplicationDetails,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeApp, setActiveApp] = useState(
    selectedApplicationDetails || null
  );

  /*
   * If another page selects an application,
   * automatically open it here.
   */
  useEffect(() => {
    if (selectedApplicationDetails) {
      setActiveApp(selectedApplicationDetails);
    }
  }, [selectedApplicationDetails]);

  /*
   * Always work with a safe array.
   */
  const safeApplications = Array.isArray(applications)
    ? applications
    : [];

  /*
   * Filter live applications from AppContext.
   */
  const filteredApps = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return safeApplications.filter((app) => {
      const id = String(app?.id || '');
      const serviceName = String(app?.serviceName || '');

      const matchesSearch =
        !search ||
        id.toLowerCase().includes(search) ||
        serviceName.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === 'All Status' ||
        String(app?.status || '') === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [safeApplications, searchTerm, statusFilter]);

  /*
   * Status badge.
   */
  const getStatusBadge = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (normalized === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Approved
        </span>
      );
    }

    if (normalized === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Rejected
        </span>
      );
    }

    if (
      normalized === 'in progress' ||
      normalized === 'under review' ||
      normalized === 'under_review'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          In Progress
        </span>
      );
    }

    if (
      normalized === 'submitted' ||
      normalized === 'pending'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Submitted
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        {status || 'Unknown'}
      </span>
    );
  };

  /*
   * Timeline icon.
   */
  const getStepIcon = (step) => {
    const status = String(step?.status || '').toLowerCase();

    if (status === 'completed') {
      return (
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      );
    }

    if (status === 'current') {
      return (
        <Clock className="w-4 h-4 text-orange-600" />
      );
    }

    return (
      <Clock className="w-4 h-4 text-slate-400" />
    );
  };

  /*
   * Empty state.
   */
  const renderEmptyState = () => {
    const hasFilters =
      searchTerm.trim() !== '' ||
      statusFilter !== 'All Status';

    return (
      <div className="py-16 px-6 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
          {hasFilters ? (
            <AlertCircle className="w-6 h-6 text-slate-400" />
          ) : (
            <FileText className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-800">
          {hasFilters
            ? 'No applications found'
            : 'No applications yet'}
        </h3>

        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {hasFilters
            ? 'Try changing your search or status filter.'
            : 'Your submitted government service applications will appear here.'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">

      {/* =========================================================
          HEADER + FILTERS
      ========================================================== */}
      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Application Tracking
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Track the status of your submitted applications across
            government departments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">

          {/* Search */}
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

          {/* Status filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
            >
              <option value="All Status">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

        </div>
      </div>

      {/* =========================================================
          APPLICATIONS TABLE
      ========================================================== */}
      <div className="light-card rounded-2xl overflow-hidden shadow-xs">

        {filteredApps.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold">
                  <th className="py-3.5 px-4">
                    Application ID
                  </th>

                  <th className="py-3.5 px-4">
                    Service Name
                  </th>

                  <th className="py-3.5 px-4">
                    Applied On
                  </th>

                  <th className="py-3.5 px-4">
                    Current Step
                  </th>

                  <th className="py-3.5 px-4">
                    Status
                  </th>

                  <th className="py-3.5 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredApps.map((app, index) => {

                  const appId =
                    app?.id ||
                    app?.applicationId ||
                    `APP-${index + 1}`;

                  const serviceName =
                    app?.serviceName ||
                    app?.schemeName ||
                    'Government Service';

                  const appliedOn =
                    app?.appliedOn ||
                    app?.submittedOn ||
                    app?.submitted_on ||
                    '—';

                  const currentStep =
                    app?.currentStep ||
                    app?.status ||
                    'Processing';

                  return (
                    <tr
                      key={appId}
                      className="hover:bg-orange-50/40 transition-colors group"
                    >

                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {appId}
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {serviceName}
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {appliedOn}
                      </td>

                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {currentStep}
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(app?.status)}
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
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =========================================================
          APPLICATION DETAIL MODAL
      ========================================================== */}
      {activeApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">

          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-modal-spring">

            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">

              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider font-mono">
                  {activeApp.id || activeApp.applicationId || 'APPLICATION'}
                </span>

                <h3 className="text-lg font-bold text-slate-900">
                  {activeApp.serviceName ||
                    activeApp.schemeName ||
                    'Government Service'}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  {activeApp.department || 'Government Department'}
                </p>
              </div>

              <button
                onClick={() => setActiveApp(null)}
                className="btn-press p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Details */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">

                <span className="text-xs font-bold text-slate-600">
                  Application Status
                </span>

                {getStatusBadge(activeApp.status)}

              </div>

              {/* Basic information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Application ID
                  </p>

                  <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                    {activeApp.id ||
                      activeApp.applicationId ||
                      '—'}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Applied On
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {activeApp.appliedOn ||
                      activeApp.submittedOn ||
                      activeApp.submitted_on ||
                      '—'}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Department
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {activeApp.department ||
                      'Government Department'}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                    Current Step
                  </p>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {activeApp.currentStep ||
                      activeApp.status ||
                      'Processing'}
                  </p>
                </div>

              </div>

              {/* Timeline */}
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-slate-600">
                    Application Progression
                  </span>
                </div>

                {Array.isArray(activeApp.steps) &&
                activeApp.steps.length > 0 ? (
                  <div className="space-y-5 relative pl-4 border-l-2 border-slate-200 ml-2">

                    {activeApp.steps.map((step, idx) => {

                      const stepStatus =
                        String(step?.status || '').toLowerCase();

                      const isDone =
                        stepStatus === 'completed';

                      const isCurrent =
                        stepStatus === 'current';

                      return (
                        <div
                          key={idx}
                          className="relative pl-5"
                        >

                          {/* Timeline dot */}
                          <span
                            className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                              isDone
                                ? 'bg-emerald-500 shadow-xs'
                                : isCurrent
                                ? 'bg-orange-500 ring-2 ring-orange-200 animate-pulse'
                                : 'bg-slate-200'
                            }`}
                          />

                          <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-2">
                              {getStepIcon(step)}

                              <p
                                className={`text-xs font-bold ${
                                  isDone
                                    ? 'text-slate-800'
                                    : isCurrent
                                    ? 'text-orange-600'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step?.name || 'Processing Step'}
                              </p>
                            </div>

                            <span className="text-[10px] text-slate-400 font-medium">
                              {step?.date || ''}
                            </span>

                          </div>

                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">

                            {isDone
                              ? 'Completed successfully'
                              : isCurrent
                              ? 'Currently being processed by the reviewing authority'
                              : 'Awaiting completion of the previous step'}

                          </p>

                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-5 text-center">

                    <Clock className="w-5 h-5 text-slate-400 mx-auto mb-2" />

                    <p className="text-xs font-semibold text-slate-700">
                      Application is being processed
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Detailed progression will appear as the application
                      moves through the workflow.
                    </p>

                  </div>
                )}

              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">

              <button
                onClick={() => setActiveApp(null)}
                className="btn-press px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-xs font-semibold text-slate-700"
              >
                Close
              </button>

              {String(activeApp.status || '').toLowerCase() ===
                'approved' && (
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

export { ApplicationTracking };
export default ApplicationTracking;