import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  GraduationCap, 
  Coins, 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  MapPin, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const UnifiedCitizenRecord = () => {
  const { 
    citizenId, 
    unifiedData, 
    eligibilityData, 
    handleSwitchCitizen, 
    setActiveTab, 
    isBackendConnected 
  } = useApp();

  const citizen = unifiedData?.citizen || {
    name: 'Gokul',
    citizen_id: citizenId,
    dob: '2007-05-04',
    gender: 'Male',
    address: 'Coimbatore, Tamil Nadu'
  };

  const education = unifiedData?.education_data || {
    institution: 'SKCET',
    course: 'B.Com',
    student_status: 'ACTIVE'
  };

  const income = unifiedData?.income_data || {
    annual_income: 120000,
    tax_status: 'NON_TAX_PAYER'
  };

  const welfareApps = unifiedData?.welfare_applications || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="light-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-white border border-orange-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200 uppercase tracking-wider">
              GovSync InterOperability Record
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              Golden Record Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Unified Citizen Data Mesh
          </h1>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl font-normal">
            Single authoritative view synthesizing identity from Registrar General, Higher Education Department, and State Income Board with zero document friction.
          </p>
        </div>

        {/* Quick Citizen Switcher Pill */}
        <div className="bg-white/95 p-3 rounded-2xl border border-orange-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {citizenId}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Query Citizen ID</span>
            <input 
              type="text" 
              defaultValue={citizenId} 
              onBlur={(e) => handleSwitchCitizen(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSwitchCitizen(e.target.value)}
              className="font-mono font-bold text-slate-900 text-xs w-28 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:outline-hidden focus:border-orange-500"
              placeholder="e.g. C001"
            />
          </div>
        </div>
      </div>

      {/* 4 Multi-Department Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Identity Pillar */}
        <div className="light-card p-5 rounded-2xl space-y-3 border-t-4 border-t-orange-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demographic</span>
            <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{citizen.name}</h3>
            <p className="text-xs font-mono text-orange-600 font-semibold">{citizen.citizen_id || citizenId}</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">DOB:</span>
              <span className="font-semibold">{citizen.dob}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Gender:</span>
              <span className="font-semibold">{citizen.gender}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">District:</span>
              <span className="font-semibold truncate max-w-[130px]">{citizen.address}</span>
            </div>
          </div>
        </div>

        {/* 2. Education Department */}
        <div className="light-card p-5 rounded-2xl space-y-3 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Higher Education</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{education.institution || 'SKCET'}</h3>
            <p className="text-xs text-blue-600 font-semibold">{education.course || 'B.Com'}</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Enrollment Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                {education.student_status || 'ACTIVE'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Registry:</span>
              <span className="font-semibold">Tamil Nadu DOTE</span>
            </div>
          </div>
        </div>

        {/* 3. Income Department */}
        <div className="light-card p-5 rounded-2xl space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue & Income</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              ₹{(income.annual_income || 120000).toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">Annual Family Income</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Tax Category:</span>
              <span className="font-bold text-slate-800">{income.tax_status || 'NON_TAX_PAYER'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Verified By:</span>
              <span className="font-semibold">State Revenue Board</span>
            </div>
          </div>
        </div>

        {/* 4. Welfare & Schemes */}
        <div className="light-card p-5 rounded-2xl space-y-3 border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Social Welfare</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <HeartHandshake className="w-4 h-4" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {welfareApps.length} Applications
            </h3>
            <p className="text-xs text-purple-600 font-semibold">Welfare Department Records</p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Scholarship Benefit:</span>
              <span className="font-bold text-purple-700">Eligible</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">DOB Integrity:</span>
              <button 
                onClick={() => setActiveTab('reconciliation')}
                className="text-amber-700 font-bold hover:underline"
              >
                Inspect Conflict →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Scheme Eligibility Showcase Card */}
      <div className="light-card rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Interoperability Eligibility Matrix</h2>
              <p className="text-xs text-slate-500">Evaluated in real-time by cross-department rules engine</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Eligible for Education Scholarship
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Criterion 1: Income Ceiling</span>
            <p className="font-bold text-slate-900">Max ₹2,50,000 / year</p>
            <p className="text-emerald-600 font-medium">Passed: Citizen at ₹1,20,000</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Criterion 2: Student Enrollment</span>
            <p className="font-bold text-slate-900">Active College Status</p>
            <p className="text-emerald-600 font-medium">Passed: SKCET B.Com enrolled</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Criterion 3: Data Consent</span>
            <p className="font-bold text-slate-900">Education & Income Access</p>
            <p className="text-emerald-600 font-medium">Ready for Instant Submission</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('reconciliation')}
            className="btn-press text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1.5"
          >
            <span>View Department Reconciliation Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('apply')}
            className="btn-press px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
          >
            Apply Now with Pre-filled Record →
          </button>
        </div>
      </div>
    </div>
  );
};
