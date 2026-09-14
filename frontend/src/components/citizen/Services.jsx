import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  Landmark, 
  Award, 
  Truck, 
  Coins, 
  Grid, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Tag, 
  ArrowRight,
  FileText,
  Building,
  GraduationCap,
  HeartHandshake,
  ShieldPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Services = () => {
  const { 
    services, 
    categories, 
    setSelectedServiceModal, 
    setActiveTab,
    searchQuery,
    setSearchQuery 
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const getServiceIcon = (title) => {
    switch (title) {
      case 'Driving License':
        return <Car className="w-6 h-6 text-orange-400" />;
      case 'Income Certificate':
        return <Landmark className="w-6 h-6 text-emerald-400" />;
      case 'Caste Certificate':
        return <Award className="w-6 h-6 text-purple-400" />;
      case 'Vehicle Registration':
        return <Truck className="w-6 h-6 text-sky-400" />;
      case 'Personal Loan':
        return <Coins className="w-6 h-6 text-amber-400" />;
      default:
        return <Grid className="w-6 h-6 text-orange-400" />;
    }
  };

  const getCategoryIcon = (catName) => {
    switch (catName) {
      case 'Identity & Documents':
        return <FileText className="w-4 h-4 text-orange-400" />;
      case 'Transport & Vehicles':
        return <Car className="w-4 h-4 text-sky-400" />;
      case 'Finance & Loans':
        return <Coins className="w-4 h-4 text-emerald-400" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Social Welfare':
        return <HeartHandshake className="w-4 h-4 text-pink-400" />;
      case 'Property & Land':
        return <Building className="w-4 h-4 text-amber-400" />;
      default:
        return <ShieldPlus className="w-4 h-4 text-teal-400" />;
    }
  };

  const filteredServices = services.filter(srv => {
    const matchesSearch = srv.title.toLowerCase().includes(localSearch.toLowerCase()) ||
                          srv.description.toLowerCase().includes(localSearch.toLowerCase());
    const matchesCat = activeCategory === 'All' || srv.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12 animate-precise-up">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-700/60 shadow-2xl bg-gradient-to-r from-[#1a1310] via-[#241812] to-[#121620]">
        <div 
          className="absolute inset-0 opacity-12 bg-cover bg-center pointer-events-none mix-blend-luminosity filter blur-[0.4px]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80')`,
            maskImage: 'radial-gradient(ellipse 95% 85% at 75% 50%, black 25%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at 75% 50%, black 25%, transparent 85%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1017] via-[#10141e]/90 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 space-y-4 max-w-3xl">
          <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            InterOp Unified Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Government Services Made Easy
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
            Explore all available services and apply online. Save time, effort and get things done — digitally.
          </p>

          {/* Search Bar inside Hero */}
          <div className="pt-2">
            <div className="relative flex items-center shadow-2xl max-w-2xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for a service (e.g. Driving License, Income Certificate...)"
                className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
              />
              <button
                onClick={() => {}}
                className="absolute right-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-orange-600/30"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid: Popular Services + Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Popular Services */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Popular Services</h2>
              <p className="text-xs text-slate-400">Frequently accessed citizen services with automated processing</p>
            </div>
            {activeCategory !== 'All' && (
              <button 
                onClick={() => setActiveCategory('All')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                Clear filter ({activeCategory})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setSelectedServiceModal(srv)}
                className="interactive-card p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 cursor-pointer flex flex-col justify-between group shadow-lg min-h-[160px]"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {getServiceIcon(srv.title)}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {srv.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">{srv.dept}</span>
                  <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Categories Menu */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl h-fit space-y-3">
          <h2 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            Categories
          </h2>

          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isSelected ? 'All' : cat.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all group ${
                    isSelected 
                      ? 'bg-orange-600/20 text-orange-400 border border-orange-500/40 font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(cat.name)}
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all ${isSelected ? 'text-orange-400' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
