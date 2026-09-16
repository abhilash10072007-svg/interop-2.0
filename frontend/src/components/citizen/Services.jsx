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
    setSelectedServiceModal
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const getServiceIcon = (title) => {
    switch (title) {
      case 'Driving License':
        return <Car className="w-6 h-6 text-orange-600" />;
      case 'Income Certificate':
        return <Landmark className="w-6 h-6 text-emerald-600" />;
      case 'Caste Certificate':
        return <Award className="w-6 h-6 text-purple-600" />;
      case 'Vehicle Registration':
        return <Truck className="w-6 h-6 text-sky-600" />;
      case 'Personal Loan':
        return <Coins className="w-6 h-6 text-amber-600" />;
      default:
        return <Grid className="w-6 h-6 text-orange-600" />;
    }
  };

  const getCategoryIcon = (catName) => {
    switch (catName) {
      case 'Identity & Documents':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'Transport & Vehicles':
        return <Car className="w-4 h-4 text-sky-500" />;
      case 'Finance & Loans':
        return <Coins className="w-4 h-4 text-emerald-500" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case 'Social Welfare':
        return <HeartHandshake className="w-4 h-4 text-pink-500" />;
      case 'Property & Land':
        return <Building className="w-4 h-4 text-amber-500" />;
      default:
        return <ShieldPlus className="w-4 h-4 text-teal-500" />;
    }
  };

  const filteredServices = services.filter(srv => {
    const matchesSearch = srv.title.toLowerCase().includes(localSearch.toLowerCase()) ||
                          srv.description.toLowerCase().includes(localSearch.toLowerCase());
    const matchesCat = activeCategory === 'All' || srv.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-orange-200/90 shadow-sm bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-white p-6 md:p-8">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none animate-living-glide"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: 'center 40%'
          }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            InterOp Unified Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Government Services Made Easy
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            Explore all available services and apply online. Save time, effort and get things done — digitally.
          </p>

          {/* Search Bar inside Hero */}
          <div className="pt-2">
            <div className="relative flex items-center shadow-xs max-w-2xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for a service (e.g. Driving License, Income Certificate...)"
                className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
              <button
                className="btn-press absolute right-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
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
              <h2 className="text-base font-bold text-slate-900">Popular Services</h2>
              <p className="text-xs text-slate-500">Frequently accessed citizen services with automated interoperable processing</p>
            </div>
            {activeCategory !== 'All' && (
              <button 
                onClick={() => setActiveCategory('All')}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold"
              >
                Clear filter ({activeCategory})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredServices.map((srv, idx) => (
              <div
                key={srv.id}
                onClick={() => setSelectedServiceModal(srv)}
                className={"light-card btn-press p-5 rounded-2xl cursor-pointer flex flex-col justify-between group min-h-[160px] animate-converge-grid card-stagger-" + ((idx % 4) + 1)}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                    {getServiceIcon(srv.title)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                    {srv.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="text-[11px] text-slate-600">{srv.dept}</span>
                  <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Categories Menu */}
        <div className="light-card rounded-2xl p-5 shadow-xs h-fit space-y-3">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Categories
          </h2>

          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isSelected ? 'All' : cat.name)}
                  className={`btn-press w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all group ${
                    isSelected 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold shadow-2xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(cat.name)}
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all ${isSelected ? 'text-orange-500' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
