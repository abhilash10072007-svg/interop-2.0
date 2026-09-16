import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Clock, 
  Receipt, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ServiceDetailsModal = () => {
  const { selectedServiceModal, setSelectedServiceModal, setActiveTab } = useApp();
  const [activeTab, setActiveModalTab] = useState('Overview');

  if (!selectedServiceModal) return null;

  const service = selectedServiceModal;
  const tabs = ['Overview', 'Eligibility', 'Documents', 'Fees'];

  const handleStartApplication = () => {
    setSelectedServiceModal(null);
    setActiveTab('apply');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-modal-spring">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 shadow-2xs">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{service.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedServiceModal(null)}
            className="btn-press p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 bg-slate-50/40">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveModalTab(tab)}
                className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all ${
                  isActive
                    ? 'text-orange-600 border-orange-500'
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              {/* Driving License Sample Visual Card */}
              <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 flex items-center gap-4 shadow-2xs">
                <div className="w-16 h-10 rounded-lg bg-white border border-orange-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <div className="w-12 h-6 border border-dashed border-orange-400 rounded flex items-center justify-center text-[9px] font-mono text-orange-600 font-bold">
                    DL CARD
                  </div>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  Apply for a new driving license or renew your existing one. This service helps you get a valid driving license as per the Motor Vehicles Act.
                </div>
              </div>

              {/* Service Meta Specs */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Clock className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Processing Time</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{service.processingTime}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Receipt className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Fee</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{service.fee}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Building2 className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Department</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{service.dept}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Eligibility' && (
            <div className="space-y-3 text-xs text-slate-700">
              <p className="font-bold text-slate-900">Eligibility Criteria:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Applicant must be an Indian citizen.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Minimum age requirement of 18 years for private motor vehicles.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Must possess a valid Learner's License issued at least 30 days prior.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="space-y-3 text-xs text-slate-700">
              <p className="font-bold text-slate-900">Required Documents for Online Verification:</p>
              <div className="grid grid-cols-1 gap-2">
                {service.reqDocs?.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Fees' && (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Government Statutory Fee</span>
                <span className="font-mono font-bold text-slate-900">₹ 150</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Smart Card & Dispatch Charges</span>
                <span className="font-mono font-bold text-slate-900">₹ 50</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between font-bold text-orange-800">
                <span>Total Payable</span>
                <span className="font-mono text-sm">₹ 200</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedServiceModal(null)}
            className="btn-press px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-xs font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleStartApplication}
            className="btn-press px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all"
          >
            <span>Start Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
