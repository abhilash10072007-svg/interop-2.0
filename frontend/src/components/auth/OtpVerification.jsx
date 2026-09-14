import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  KeyRound, 
  RotateCw, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OtpVerification = () => {
  const { 
    authCredential, 
    setAuthView, 
    setIsAuthenticated, 
    setActiveTab, 
    showToast, 
    triggerConfetti 
  } = useApp();

  const [otp, setOtp] = useState(['4', '5', '6', '7', '2', '1']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      showToast('Please enter the full 6-digit OTP', 'error');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      showToast('Identity verified! Welcome to InterOp Portal.', 'success', 'Login Successful');
      triggerConfetti();
    }, 600);
  };

  const handleResend = () => {
    setTimer(60);
    showToast('A new 6-digit OTP has been dispatched.', 'info');
  };

  const handleQuickFill = () => {
    setOtp(['4', '5', '6', '7', '2', '1']);
    showToast('Demo OTP 456721 filled!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#090b10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Lighting */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80')`
        }}
      />
      <div className="absolute top-10 -right-10 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Verification Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-precise-up space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setAuthView('login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Enter Verification Code</h1>
          <p className="text-xs text-slate-400">
            We sent a 6-digit one-time code to <span className="font-mono text-orange-400 font-semibold">{authCredential}</span>
          </p>
        </div>

        {/* 6 Individual Auto-Focus OTP Inputs */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-bold text-white bg-slate-800/90 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all font-mono"
            />
          ))}
        </div>

        {/* Timer & Resend */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {timer > 0 ? (
              <span>Resend code in <strong className="text-orange-400 font-mono">{timer}s</strong></span>
            ) : (
              <span className="text-slate-500">Didn't receive code?</span>
            )}
          </span>

          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Resend OTP</span>
          </button>
        </div>

        {/* Verify CTA */}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <span>Verifying Credentials...</span>
          ) : (
            <>
              <span>Verify & Access Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Auto Fill Quick Button */}
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">Demo Code received in notification:</p>
          <button
            onClick={handleQuickFill}
            className="mt-1 text-xs font-mono font-bold text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1.5 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>456721 (Click to auto-fill)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
