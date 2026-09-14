import React from 'react';
import { ShieldCheck, Phone, Mail, Building, ExternalLink, Heart, Globe, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 no-print mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                iO
              </div>
              <span className="text-xl font-black text-white tracking-tight">Inter<span className="text-blue-500">Op</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              InterOp is the unified digital public infrastructure designed to bridge government departments, citizen identity records, workflow orchestration, and automated AI verification.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted eKYC</span>
            </div>
          </div>

          {/* Column 2: Key Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">Driving License Issuance & Renewal</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Vehicle Registration Certificate (RC)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Income & Revenue Certificates</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Senior Citizen Pension Registration</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Ayushman Digital ABHA Card</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Udyam MSME Registration</a></li>
            </ul>
          </div>

          {/* Column 3: Government Portals Integration */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Connected Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ExternalLink className="w-3 h-3 text-blue-400" /> DigiLocker National Repository</li>
              <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ExternalLink className="w-3 h-3 text-blue-400" /> UIDAI Aadhaar Portal</li>
              <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ExternalLink className="w-3 h-3 text-blue-400" /> Parivahan Sewa Portal</li>
              <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ExternalLink className="w-3 h-3 text-blue-400" /> Income Tax e-Filing Portal</li>
              <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><ExternalLink className="w-3 h-3 text-blue-400" /> National Portal of India</li>
            </ul>
          </div>

          {/* Column 4: Helpline & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Helpdesk & Emergency
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Toll-Free Helpline</div>
                  <div>1800-11-2026 / 1800-425-0010</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Email Support</div>
                  <div>support@interop.gov.in</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">National Informatics Center</div>
                  <div>CGO Complex, Lodhi Road, New Delhi</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Official Government Digital Public Infrastructure — InterOp Platform © 2026. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Security Audit Certificate</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
