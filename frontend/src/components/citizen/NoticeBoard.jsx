import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Calendar, ExternalLink, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const NoticeBoard = () => {
  const { notices } = useApp();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Important', 'General', 'Maintenance'];

  const filteredNotices = filter === 'All' 
    ? notices 
    : notices.filter(n => n.category === filter);

  return (
    <div id="notice-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Official Government Gazette & Announcements</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            InterOp Notice Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Latest circulars, scheme updates, maintenance schedules, and public policy releases.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.map((notif) => (
          <div 
            key={notif.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  notif.category === 'Important' 
                    ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                    : notif.category === 'Maintenance'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {notif.category}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {notif.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{notif.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{notif.summary}</p>
            </div>

            <button 
              onClick={() => alert(`Opening official gazette document: ${notif.title}`)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 hover:text-blue-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
            >
              <span>Read Gazette</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
