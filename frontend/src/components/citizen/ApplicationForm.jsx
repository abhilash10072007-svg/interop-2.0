import React, { useState } from 'react';
import { 
  Car, 
  Calendar, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationForm = () => {
  const { user, handleCreateApplication, setActiveTab } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user.name || 'Arjun Kumar',
    dob: user.dob || '1996-08-12',
    gender: user.gender || 'Male',
    mobile: user.mobile || '+91 98765 43210',
    email: user.email || 'arjun.kumar@email.com',
    aadhaar: user.aadhaarNumber || 'XXXX-XXXX-4021',
    addressLine: 'No. 12, MG Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641001',
    licenseType: 'Light Motor Vehicle (LMV) + Motorcycle',
    rtoLocation: 'TN-37 (Coimbatore South)',
    docUploaded: true,
    consentAgreed: true
  });

  const steps = [
    { num: 1, title: 'Personal Details' },
    { num: 2, title: 'Address Details' },
    { num: 3, title: 'Documents' },
    { num: 4, title: 'Review & Submit' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCreateApplication({
        serviceName: 'Driving License',
        category: 'Transport & Vehicles',
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
      <div className="light-card flex items-center gap-4 p-5 rounded-2xl shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shadow-2xs">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Driving License Application</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ministry of Road Transport & Highways • Parivahan Interoperable Gateway
          </p>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="light-card p-4 rounded-2xl shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] px-4">
          {steps.map((step, idx) => {
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
                      isCurrent ? 'text-slate-900 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all ${
                      currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content Steps */}
      <div className="light-card p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 1: Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Aadhaar Number (eKYC Linked)</label>
                <input
                  type="text"
                  disabled
                  value={formData.aadhaar}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 2: Address & RTO Jurisdiction</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Address Line</label>
                <input
                  type="text"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Postal Code / PIN</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Nearest Regional Transport Office (RTO)</label>
                <input
                  type="text"
                  value={formData.rtoLocation}
                  onChange={(e) => setFormData({ ...formData, rtoLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 3: Document Verification (DigiLocker Integrated)</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Aadhaar Card (UIDAI eKYC)</p>
                    <p className="text-[11px] text-slate-500">Auto-fetched and cryptographically verified</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Verified ✓
                </span>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Learner License No. TN-37/LL/2024/008812</p>
                    <p className="text-[11px] text-slate-500">Auto-fetched from Parivahan National Registry</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Verified ✓
                </span>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-orange-400 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all">
                <UploadCloud className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Upload Medical Fitness Certificate (Optional)</p>
                  <p className="text-[10px] text-slate-400">PDF, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Step 4: Review Application & Interoperability Consent</h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Applicant:</span><span className="font-bold text-slate-900">{formData.fullName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Service Scheme:</span><span className="font-bold text-slate-900">Driving License (LMV)</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Jurisdiction:</span><span className="font-bold text-slate-900">{formData.rtoLocation}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Citizen ID:</span><span className="font-mono font-bold text-orange-600">{user.citizenId}</span></div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold">InterOp Auto-Consent Enabled:</span> I authorize the InterOp gateway to exchange verified credentials between UIDAI, Parivahan, and State Welfare databases for expedited digital issuance.
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
