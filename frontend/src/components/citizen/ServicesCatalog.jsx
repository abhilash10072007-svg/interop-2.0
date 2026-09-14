import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Car, 
  FileText, 
  Landmark, 
  Sprout, 
  HeartHandshake, 
  Activity, 
  Building2, 
  Award, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';

export const ServicesCatalog = () => {
  const { 
    services, 
    searchTerm, 
    categoryFilter, 
    setCategoryFilter,
    setSelectedServiceForApp,
    setIsAppModalOpen
  } = useApp();

  const iconMap = {
    Car: <Car className="w-6 h-6 text-blue-600" />,
    FileText: <FileText className="w-6 h-6 text-blue-600" />,
    Landmark: <Landmark className="w-6 h-6 text-amber-600" />,
    Sprout: <Sprout className="w-6 h-6 text-emerald-600" />,
    HeartHandshake: <HeartHandshake className="w-6 h-6 text-purple-600" />,
    Activity: <Activity className="w-6 h-6 text-rose-600" />,
    Building2: <Building2 className="w-6 h-6 text-sky-600" />,
    Award: <Award className="w-6 h-6 text-indigo-600" />
  };

  const categories = ['All', 'Land & Transport', 'Certificates', 'Welfare & Schemes', 'Business & Taxes'];

  const filteredServices = services.filter(srv => {
    const matchesSearch = 
      srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || srv.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleApplyClick = (service) => {
    setSelectedServiceForApp(service);
    setIsAppModalOpen(true);
  };

  return (
    <div id="services-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Catalog Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Digital Government Services Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Government Workflow Portals
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Select a service to initiate digital e-filing. All forms support instant document pre-filling via linked Aadhaar & DigiLocker records.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (Matching Image 2 Clean Card Grid Layout) */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching services found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or switching category tabs to browse available department workflows.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="space-y-4">
                
                {/* Header Row: Icon & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    {iconMap[srv.icon] || <FileText className="w-6 h-6 text-blue-600" />}
                  </div>

                  <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {srv.badge}
                  </span>
                </div>

                {/* Service Info */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    {srv.dept}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {srv.description}
                  </p>
                </div>

                {/* AI Feature Pill */}
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate font-medium">{srv.aiSupport}</span>
                </div>

              </div>

              {/* Card Footer Details & Apply Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {srv.processingTime}
                  </span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {srv.fee}
                  </span>
                </div>

                <button
                  onClick={() => handleApplyClick(srv)}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
