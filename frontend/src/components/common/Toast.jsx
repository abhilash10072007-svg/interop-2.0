import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />
  };

  const bgStyles = {
    success: 'bg-slate-900 border-emerald-500/50 text-white',
    warning: 'bg-slate-900 border-amber-500/50 text-white',
    info: 'bg-slate-900 border-blue-500/50 text-white',
    error: 'bg-slate-900 border-red-500/50 text-white'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300 no-print">
      <div className={`p-4 rounded-2xl shadow-2xl border ${bgStyles[toast.type] || bgStyles.info} flex items-start gap-3 relative overflow-hidden backdrop-blur-lg`}>
        {icons[toast.type] || icons.info}
        <div className="flex-1 pr-4">
          {toast.title && (
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-0.5">{toast.title}</h4>
          )}
          <p className="text-xs text-slate-300 font-medium leading-snug">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
