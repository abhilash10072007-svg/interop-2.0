import React, { useState } from 'react';
import { 
  GraduationCap, 
  Car, 
  Calendar, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationForm = () => {
  const { user, citizenId, handleCreateApplication, setActiveTab } = useApp();

  const [selectedScheme, setSelectedScheme] = useState('Education Scholarship');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user.name || 'Gokul',
    dob: user.dob || '2007-05-04',
    gender: user.gender || 'Male',
    mobile: user.mobile || '+91 98765 43210',
    email: user.email || 'gokul@interop.gov.in',
    aadhaar: user.aadhaarNumber || 'XXXX-XXXX-4021',
    addressLine: 'Coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641001',
    institution: 'SKCET',
    course: 'B.Com',
    annualIncome: '120000',
    docUploaded: true,
    consentAgreed: true
  });

  const steps = [
    { num: 1, title: 'Scheme & Identity' },
    { num: 2, title: 'Eligibility Details' },
    { num: 3, title: 'InterOp Verification' },
    { num: 4, title: 'Review & Submit' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCreateApplication({
        serviceName: selectedScheme,
        category: selectedScheme === 'Education Scholarship' ? 'Social Welfare & Education' : 'Transport & Vehicles',
        ...formData
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setActiveTab('services');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Service Header */}
      <div className="light-card flex items-center justify-between p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shadow-2xs">
            {selectedScheme === 'Education Scholarship' ? <GraduationCap className="w-6 h-6" /> : <Car className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{selectedScheme} Application</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              GovSync Multi-Department Interoperability Gateway &bull; Citizen Ref: <span className="font-mono font-bold text-orange-600">{citizenId}</span>
            </p>
          </div>
        </div>

        {/* Scheme Selector */}
        <select
          value={selectedScheme}
          onChange={(e) => setSelectedScheme(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-orange-500"
        >
          <option value="Education Scholarship">Education Scholarship (Live InterOp)</option>
          <option value="Driving License">Driving License (Transport)</option>
        </select>
      </div>

      {/* Stepper Header */}
      <div className="light-card p-4 rounded-2xl shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] px-4">
          {steps.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-orange-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {step.num < 4 && <div className="flex-1 h-0.5 mx-3 bg-slate-200" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content Area */}
      <div className="light-card p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
        {/* Step 1: Personal Identity */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 1: Verified Citizen Demographics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Citizen Identifier</label>
                <input
                  type="text"
                  disabled
                  value={citizenId}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-orange-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Permanent Location</label>
                <input
                  type="text"
                  value={formData.city + ', ' + formData.state}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Eligibility Criteria Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 2: Department Eligibility Attributes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Educational Institution (Higher Ed)</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Course / Degree Program</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Annual Household Income (₹)</label>
                <input
                  type="text"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Scheme Eligibility Ceiling</label>
                <input
                  type="text"
                  disabled
                  value="₹2,50,000 / year (Eligibility Check PASSED)"
                  className="w-full px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: InterOp Auto-Verification */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 3: Zero-Upload Interoperable Verification</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">SKCET Enrollment & Student Status</p>
                    <p className="text-[11px] text-slate-500">Auto-verified via Higher Education Department Registry</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                  ACTIVE ✓
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Income Assessment (₹1,20,000)</p>
                    <p className="text-[11px] text-slate-500">Auto-verified via State Revenue Department</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                  NON_TAX_PAYER ✓
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Zero physical document uploads required: all credentials federated automatically through GovSync APIs.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 4: Review Application & Submit to FastAPI</h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Applicant Name:</span><span className="font-bold text-slate-900">{formData.fullName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Citizen Reference:</span><span className="font-mono font-bold text-orange-600">{citizenId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Scheme:</span><span className="font-bold text-slate-900">{selectedScheme}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Reviewing Authority:</span><span className="font-bold text-slate-900">State Welfare Department (Officer U002)</span></div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold">InterOp Consent Active:</span> You are submitting this application to FastAPI endpoint <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">POST /api/applications/submit</code>. Required cross-department consents will be verified seamlessly.
              </p>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            className="btn-press flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Back to Services' : 'Previous Step'}</span>
          </button>

          <button
            onClick={handleNext}
            className="btn-press flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/25"
          >
            <span>{currentStep === 4 ? 'Confirm & Submit to FastAPI' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
