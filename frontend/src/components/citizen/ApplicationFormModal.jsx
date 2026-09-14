import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Eye
} from 'lucide-react';

export const ApplicationFormModal = () => {
  const { 
    isAppModalOpen, 
    setIsAppModalOpen, 
    selectedServiceForApp, 
    user, 
    handleCreateApplication 
  } = useApp();

  const [step, setStep] = useState(1); // 1: Info, 2: Docs & ML OCR, 3: Review
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(null);

  // Form Fields
  const [reason, setReason] = useState('Renewal of existing permit / registration');
  const [declaration, setDeclaration] = useState(true);

  if (!isAppModalOpen || !selectedServiceForApp) return null;

  const handleSimulateDocUpload = () => {
    setIsScanningDoc(true);
    setTimeout(() => {
      setIsScanningDoc(false);
      setDocUploaded(true);
      setOcrConfidence({
        nameMatch: '100% (Gokul S.)',
        dobMatch: '100% (12-Jan-1995)',
        faceMatch: '99.4% Verified',
        fraudRisk: 'LOW RISK (Score: 0.02)'
      });
    }, 1800);
  };

  const handleSubmitFinal = (e) => {
    e.preventDefault();
    handleCreateApplication({
      serviceId: selectedServiceForApp.id,
      serviceName: selectedServiceForApp.title,
      department: selectedServiceForApp.dept,
      ocrDetails: ocrConfidence || { nameMatch: '99%', addressMatch: '95%', faceMatch: '98%' }
    });

    // Reset & Close
    setIsAppModalOpen(false);
    setStep(1);
    setDocUploaded(false);
    setOcrConfidence(null);
  };

  const handleClose = () => {
    setIsAppModalOpen(false);
    setStep(1);
    setDocUploaded(false);
    setOcrConfidence(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
              iO
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                {selectedServiceForApp.dept}
              </span>
              <h3 className="text-base font-bold text-white">{selectedServiceForApp.title}</h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-600 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center">1</span>
            <span>Applicant Info</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>2</span>
            <span>ML Document OCR</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>3</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Form Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Pre-filled via Aadhaar eKYC</span>
                  <span>Your personal details have been securely auto-populated from your linked Aadhaar record.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" readOnly value={user.name} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input type="text" readOnly value={user.phone} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Aadhaar Token</label>
                  <input type="text" readOnly value={user.aadhaarNumber} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Application Fee</label>
                  <input type="text" readOnly value={selectedServiceForApp.fee} className="w-full px-3.5 py-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Purpose / Reason for Application</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={2}
                ></textarea>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Required Document Scanning</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload document image for real-time AI OCR & face verification.
                </p>
              </div>

              {!docUploaded ? (
                <div 
                  onClick={handleSimulateDocUpload}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isScanningDoc 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                  }`}
                >
                  {isScanningDoc ? (
                    <div className="space-y-3">
                      <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                      <div className="text-xs font-bold text-blue-900">Scanning Document with ML Microservice...</div>
                      <div className="w-48 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-600 animate-pulse"></div>
                      </div>
                      <p className="text-[11px] text-slate-500">Extracting text fields & computing face match vector score...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <UploadCloud className="w-12 h-12 text-blue-600 mx-auto" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Click to Upload Document / Select File</div>
                        <div className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, PDF (Max 5MB)</div>
                      </div>
                      <button type="button" className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                        Simulate AI Document Upload
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>AI OCR Extraction Passed Successfully</span>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-2xl border border-emerald-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Name Match</span>
                      <strong className="text-emerald-700 font-mono">{ocrConfidence.nameMatch}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">DOB Verification</span>
                      <strong className="text-emerald-700 font-mono">{ocrConfidence.dobMatch}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Face Match Score</span>
                      <strong className="text-emerald-700 font-mono">{ocrConfidence.faceMatch}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Fraud Model Rating</span>
                      <strong className="text-emerald-700 font-mono">{ocrConfidence.fraudRisk}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Application Summary
                </h4>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">{selectedServiceForApp.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-800">{selectedServiceForApp.dept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Risk Assessment:</span>
                  <span className="font-bold text-emerald-600">Passed (Low Risk)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="decl"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="decl" className="text-xs text-slate-600 font-medium cursor-pointer">
                  I hereby declare that all provided information is accurate and matches my Aadhaar record.
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinal}
              disabled={!declaration}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
