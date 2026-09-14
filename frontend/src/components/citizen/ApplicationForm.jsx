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
  CheckCircle2, 
  AlertCircle 
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-precise-up">
      {/* Service Header */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Driving License</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Apply for a new driving license or renew your existing one.
          </p>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] px-4">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isCurrent ? 'text-orange-400 font-semibold' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      currentStep > step.num ? 'bg-emerald-500/70' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date of Birth *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile Number *
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email ID *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Aadhaar Number *
              </label>
              <input
                type="text"
                value={formData.aadhaar}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Address Details */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
            Address & RTO Jurisdiction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Residential Address Line
              </label>
              <input
                type="text"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                City / District
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                PIN Code
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Designated RTO Office
              </label>
              <input
                type="text"
                value={formData.rtoLocation}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Documents */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
            Upload Verification Documents
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-dashed border-slate-700 hover:border-orange-500/60 bg-slate-800/40 transition-colors flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-8 h-8 text-orange-400 mb-2" />
              <p className="text-xs font-semibold text-white">Upload Medical Fitness Certificate (Form 1A)</p>
              <p className="text-[11px] text-slate-400 mt-1">Drag and drop PDF or JPG (Max 2MB)</p>
              <span className="mt-3 px-3 py-1 bg-slate-800 text-orange-400 text-xs rounded-lg border border-slate-700">
                Browse Files
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">Aadhaar eKYC Pre-Verified</p>
                  <p className="text-[11px] text-slate-400">Identity and Residence Proof verified from UIDAI vault</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">Verified ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
            Review Application Details
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">Applicant Name</p>
              <p className="font-semibold text-white mt-1">{formData.fullName}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">Date of Birth</p>
              <p className="font-semibold text-white mt-1">{formData.dob}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">Mobile</p>
              <p className="font-semibold text-white mt-1">{formData.mobile}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">Aadhaar</p>
              <p className="font-semibold text-white mt-1">{formData.aadhaar}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">RTO Jurisdiction</p>
              <p className="font-semibold text-white mt-1">{formData.rtoLocation}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
              <p className="text-slate-400">Estimated Fee</p>
              <p className="font-semibold text-emerald-400 mt-1">₹ 200 (approx)</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/80">
            <input
              type="checkbox"
              id="consent-declaration"
              checked={formData.consentAgreed}
              onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
              className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="consent-declaration" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              I hereby declare that the information provided above is true and authentic to the best of my knowledge under the Motor Vehicles Act.
            </label>
          </div>
        </div>
      )}

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center gap-1.5"
        >
          <span>{currentStep === 4 ? 'Submit Application' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
