import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, CheckCircle2, RefreshCw, X, ArrowLeft, Building, Sparkles } from 'lucide-react';

export const AadhaarLinkModal = () => {
  const { isAadhaarModalOpen, setIsAadhaarModalOpen, handleLinkAadhaar, user } = useApp();
  
  const [step, setStep] = useState('input'); // 'input', 'otp', 'success'
  const [aadhaarInput, setAadhaarInput] = useState(user.aadhaarNumber || '3892-1049-4210');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAadhaarModalOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep('otp');
    setTimer(30);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto-advance input focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['9', '8', '7', '6', '5', '4']);
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      handleLinkAadhaar(aadhaarInput);
    }, 1200);
  };

  const handleClose = () => {
    setIsAadhaarModalOpen(false);
    setStep('input');
    setOtpDigits(['', '', '', '', '', '']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Banner Column (Matching Image 1 Left Govt Side Banner) */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                iO
              </div>
              <span className="text-xl font-extrabold tracking-tight">InterOp Identity</span>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-2xl font-black leading-tight text-white">
                Your Gateway to Government Services
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                Securely link your UIDAI Aadhaar record to enable instant 1-click verification across 150+ central & state portals.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 bg-blue-800/40 p-2.5 rounded-xl border border-blue-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Access 150+ Public Services</span>
              </div>
              <div className="flex items-center gap-2.5 bg-blue-800/40 p-2.5 rounded-xl border border-blue-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fetch DigiLocker Certificates Instantly</span>
              </div>
              <div className="flex items-center gap-2.5 bg-blue-800/40 p-2.5 rounded-xl border border-blue-700/50">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>256-Bit eKYC Encrypted Ledger</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-blue-800/60 text-[11px] text-blue-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Government UIDAI Compliant Gateway</span>
          </div>
        </div>

        {/* Right Interactive Form Column (Matching Image 1 Right Form & OTP) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Step 1 of 2</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Link Your Aadhaar</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your 12-digit Aadhaar number to fetch eKYC identity records.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="3892-1049-4210"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    An OTP will be dispatched to the mobile number registered with your UIDAI Aadhaar record ({user.phone}).
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Send OTP</span>
                </button>
              </form>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <button
                onClick={() => setStep('input')}
                className="text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change details</span>
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Verify OTP</h2>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit OTP sent to your registered mobile number <br />
                  <strong className="text-slate-800 font-mono">{user.phone}</strong>
                </p>
              </div>

              {/* 6-Digit OTP Box Grid (Exact 1st image OTP box layout) */}
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleFillDemoOtp}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg"
                  >
                    <span>⚡ Fill Test OTP: 987654</span>
                  </button>

                  <span className="text-slate-500 font-medium">
                    OTP valid for <strong className="text-slate-900 font-mono">00:{timer < 10 ? `0${timer}` : timer}</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join('').length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying eKYC Ledger...</span>
                    </>
                  ) : (
                    <span>Verify & Continue →</span>
                  )}
                </button>

              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border-4 border-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">Aadhaar Linked Successfully!</h2>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                  Your identity token <strong className="text-slate-800 font-mono">{aadhaarInput}</strong> is active across InterOp.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Citizen Name:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">eKYC Provider:</span>
                  <span className="font-bold text-emerald-600">UIDAI Central Vault</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DigiLocker Integration:</span>
                  <span className="font-bold text-blue-600">Ready</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your verification is protected, encrypted, and audit-logged.</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
