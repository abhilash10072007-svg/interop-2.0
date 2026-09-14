import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Award, 
  Download, 
  Eye, 
  ChevronRight, 
  Building, 
  ShieldCheck, 
  XCircle,
  X,
  Printer
} from 'lucide-react';

export const ApplicationTracker = () => {
  const { applications, activeCertificateApp, setActiveCertificateApp } = useApp();

  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState(applications[0] || null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'In Progress':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            In Progress
          </span>
        );
      case 'Action Needed':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Action Needed
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="applications-tracker" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Real-time Application Workflow Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Applications & Digital Certificates
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor step-by-step workflow progress, automated ML verification flags, and download officially signed digital certificates.
        </p>
      </div>

      {/* Overview Stats Cards (Matching Image 1 Application Header) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Filed</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{applications.length}</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {applications.filter(a => a.status === 'In Progress').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {applications.filter(a => a.status === 'Approved').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates Ready</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {applications.filter(a => a.status === 'Approved').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Applications Table + Active Timeline Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Applications Table (8 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Submitted Applications</h3>
            <span className="text-xs text-slate-500 font-medium">Click application to view timeline</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {applications.map((app) => {
              const isSelected = selectedAppForTimeline?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppForTimeline(app)}
                  className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">{app.id}</span>
                      <span className="text-[10px] text-slate-400">&bull; {app.submittedDate}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{app.serviceName}</h4>
                    <p className="text-[11px] text-slate-500">{app.department}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}

                    {app.status === 'Approved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCertificateApp(app);
                        }}
                        className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                        title="View Official Certificate"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    )}

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
            Showing all active citizen workflow instances
          </div>
        </div>

        {/* Right Column: Workflow Steps Timeline Tracker (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          {selectedAppForTimeline ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    {selectedAppForTimeline.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedAppForTimeline.serviceName}
                  </h3>
                </div>
                {getStatusBadge(selectedAppForTimeline.status)}
              </div>

              {/* Steps Vertical Timeline */}
              <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-2">
                {selectedAppForTimeline.steps.map((step, idx) => {
                  let stepColor = 'bg-slate-300 text-slate-600';
                  let ringColor = 'border-slate-200';

                  if (step.status === 'completed') {
                    stepColor = 'bg-emerald-600 text-white';
                    ringColor = 'border-emerald-200';
                  } else if (step.status === 'current') {
                    stepColor = 'bg-amber-500 text-white animate-pulse';
                    ringColor = 'border-amber-200';
                  } else if (step.status === 'failed') {
                    stepColor = 'bg-rose-600 text-white';
                    ringColor = 'border-rose-200';
                  }

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[25px] top-0.5 w-6 h-6 rounded-full ${stepColor} border-4 ${ringColor} flex items-center justify-center text-[10px] font-bold shadow-xs`}>
                        {idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{step.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{step.date}</span>
                        </div>

                        {idx === 1 && (
                          <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 font-mono">
                            <div className="flex justify-between">
                              <span>OCR Name Match:</span>
                              <strong className="text-emerald-700">{selectedAppForTimeline.ocrDetails.nameMatch}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Face Match Vector:</span>
                              <strong className="text-emerald-700">{selectedAppForTimeline.ocrDetails.faceMatch}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Risk Score:</span>
                              <strong className="text-blue-700">{selectedAppForTimeline.riskScore}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedAppForTimeline.status === 'Approved' && (
                <button
                  onClick={() => setActiveCertificateApp(selectedAppForTimeline)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>View Signed Digital Certificate</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an application to view workflow status
            </div>
          )}
        </div>

      </div>

      {/* Official Certificate Modal Overlay */}
      {activeCertificateApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-8 relative space-y-6">
            
            <button
              onClick={() => setActiveCertificateApp(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Official Certificate Box */}
            <div className="border-4 border-double border-blue-900 p-6 rounded-2xl bg-gradient-to-b from-amber-50/30 via-white to-blue-50/20 text-center space-y-4 relative">
              
              <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase text-blue-900">Government of India</span>
                  <h3 className="text-xs font-bold text-slate-800">InterOp Public Service Authority</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  iO
                </div>
              </div>

              <div className="py-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">Official Digital Record</span>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {activeCertificateApp.serviceName}
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Certificate Ref No: {activeCertificateApp.certificateNo}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Issued To:</span>
                  <span className="font-bold text-slate-900">{activeCertificateApp.applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar Token:</span>
                  <span className="font-bold font-mono text-slate-800">{activeCertificateApp.aadhaarNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-800">{activeCertificateApp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Digital Signature:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Cryptographic Stamp
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400">
                This document is digitally generated by InterOp Public Infrastructure and is valid legally under Section 6A of the IT Act.
              </div>

            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setActiveCertificateApp(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
