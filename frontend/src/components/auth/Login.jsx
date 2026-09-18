import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Fingerprint,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

const Login = () => {
  const {
    handleCitizenLogin,
    showToast,
    isLoadingCitizen,
  } = useApp();

  const [authMethod, setAuthMethod] = useState('mobile');
  const [inputVal, setInputVal] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  /*
   * Mobile login
   * Uses the real citizens table through:
   *
   * /api/citizens/by-mobile/{mobile}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = inputVal.trim();

    if (!value) {
      showToast(
        'Please enter your registered mobile number.',
        'error'
      );
      return;
    }

    /*
     * Aadhaar login is kept in the UI because the portal
     * supports Aadhaar as an identity method.
     *
     * Currently the backend citizens table does not contain
     * an Aadhaar column, so real citizen lookup is performed
     * using the registered mobile number.
     */
    if (authMethod === 'aadhaar') {
      showToast(
        'Aadhaar login is not connected to the citizen database yet. Please use your registered mobile number.',
        'info',
        'Aadhaar Login'
      );
      return;
    }

    try {
      const result = await handleCitizenLogin(value);

      if (result?.success) {
        showToast(
          `Welcome, ${result.citizen?.name || 'Citizen'}!`,
          'success',
          'Login Successful'
        );
      }
    } catch (error) {
      console.error('Citizen login error:', error);

      showToast(
        error?.message || 'Unable to login. Please try again.',
        'error',
        'Login Failed'
      );
    }
  };

  /*
   * Quick demo login using the real C001 mobile number
   * from the Supabase citizens table.
   */
  const handleInstantDemoLogin = async () => {
    const demoMobile = '9339670711';

    setAuthMethod('mobile');
    setInputVal(demoMobile);

    try {
      const result = await handleCitizenLogin(demoMobile);

      if (result?.success) {
        showToast(
          `Signed in as ${result.citizen?.name || 'Citizen'}`,
          'success',
          'Demo Login Successful'
        );
      }
    } catch (error) {
      console.error('Demo login error:', error);

      showToast(
        error?.message || 'Demo login failed.',
        'error',
        'Login Failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-screen"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Background Lighting */}
      <div className="absolute top-10 -left-10 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-precise-up">

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white shadow-xl shadow-orange-500/25 mb-2">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18" />
              <path d="M3 12h18" />
              <path d="m5.6 5.6 12.8 12.8" />
              <path d="m18.4 5.6-12.8 12.8" />
            </svg>

          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Inter<span className="text-orange-500">Op</span>
          </h1>

          <p className="text-xs text-slate-400">
            Official Citizen Digital Gateway & Services Portal
          </p>

        </div>

        {/* Mobile / Aadhaar Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">

          {/* Mobile */}
          <button
            type="button"
            onClick={() => {
              setAuthMethod('mobile');
              setInputVal('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'mobile'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>

          {/* Aadhaar */}
          <button
            type="button"
            onClick={() => {
              setAuthMethod('aadhaar');
              setInputVal('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'aadhaar'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Aadhaar</span>
          </button>

        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>

            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {authMethod === 'mobile'
                ? 'Mobile Number (Registered with Aadhaar)'
                : '12-Digit Aadhaar Number'}
            </label>

            <div className="relative">

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  authMethod === 'mobile'
                    ? '9339670711'
                    : 'XXXX-XXXX-4021'
                }
                disabled={isLoadingCitizen}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono disabled:opacity-50"
              />

            </div>

            {/* Backend explanation */}
            {authMethod === 'mobile' && (
              <p className="text-[10px] text-slate-500 mt-2">
                Your number is matched against the InterOp citizen registry.
              </p>
            )}

            {authMethod === 'aadhaar' && (
              <p className="text-[10px] text-slate-500 mt-2">
                Aadhaar identity login will be connected to the identity
                registry in the next backend step.
              </p>
            )}

          </div>

          {/* Remember Device */}
          <div className="flex items-center justify-between text-xs text-slate-400">

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                className="rounded text-orange-600 focus:ring-orange-500"
              />

              <span>Remember this device</span>

            </label>

            <span className="text-slate-500 text-[11px]">
              eKYC Protected
            </span>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoadingCitizen}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 group"
          >

            {isLoadingCitizen ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting to Citizen Registry...</span>
              </>
            ) : (
              <>
                <span>
                  {authMethod === 'mobile'
                    ? 'Access Citizen Portal'
                    : 'Verify Aadhaar'}
                </span>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}

          </button>

        </form>

        {/* Demo Fast Track */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-3">

          <p className="text-[11px] text-slate-400">
            Quick Testing / Demo Mode:
          </p>

          <button
            type="button"
            onClick={handleInstantDemoLogin}
            disabled={isLoadingCitizen}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >

            <Sparkles className="w-3.5 h-3.5 text-orange-400" />

            <span>
              Continue with Demo Citizen
            </span>

          </button>

          <p className="text-[10px] text-slate-600 font-mono">
            Demo mobile: 9339670711
          </p>

        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">

          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />

          <span>
            256-Bit Encrypted Government Data Security
          </span>

        </div>

        {/* Backend Connection Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="text-[9px] text-slate-500 uppercase tracking-wider">
            InterOp Gateway Ready
          </span>

        </div>

      </div>
    </div>
  );
};

export default Login;