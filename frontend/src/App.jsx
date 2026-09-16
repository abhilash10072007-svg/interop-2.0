import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { MobileNav } from './components/layout/MobileNav';

// Citizen Views
import { Dashboard } from './components/citizen/Dashboard';
import { UnifiedCitizenRecord } from './components/citizen/UnifiedCitizenRecord';
import { ReconciliationView } from './components/citizen/ReconciliationView';
import { Services } from './components/citizen/Services';
import { ApplicationForm } from './components/citizen/ApplicationForm';
import { ApplicationTracking } from './components/citizen/ApplicationTracking';
import { ConsentManagement } from './components/citizen/ConsentManagement';
import { NotificationsPage } from './components/citizen/NotificationsPage';
import { Profile } from './components/citizen/Profile';
import { ServiceDetailsModal } from './components/citizen/ServiceDetailsModal';
import { AadhaarLinkModal } from './components/citizen/AadhaarLinkModal';

// Officer & Admin Views
import { OfficerReviewQueue } from './components/official/OfficerReviewQueue';
import { AdminAnalytics } from './components/admin/AdminAnalytics';

import { ArrowUp } from 'lucide-react';
import { Toast } from './components/common/Toast';
import { useScrollAnimation } from './hooks/useScrollAnimation';

const MainLayout = () => {
  const { activeTab, currentPortal, isSidebarPinned } = useApp();
  const { scrollProgress, isScrollingUp } = useScrollAnimation();

  // Render view based on active tab and portal
  const renderContentView = () => {
    // Shared views across portals
    if (activeTab === 'unified') return <UnifiedCitizenRecord />;
    if (activeTab === 'reconciliation') return <ReconciliationView />;

    // Portal-specific default views
    if (currentPortal === 'officer') {
      if (activeTab === 'review-queue') return <OfficerReviewQueue />;
      return <OfficerReviewQueue />;
    }

    if (currentPortal === 'admin') {
      if (activeTab === 'analytics') return <AdminAnalytics />;
      return <AdminAnalytics />;
    }

    // Citizen Portal Views
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <Services />;
      case 'apply':
        return <ApplicationForm />;
      case 'applications':
      case 'tracking':
        return <ApplicationTracking />;
      case 'consent':
        return <ConsentManagement />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Full-Screen Ambient Living Motion Graphics Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated Monument Backdrop (Continuous Living Motion) */}
        <div 
          className="absolute inset-0 opacity-[0.24] bg-cover bg-center pointer-events-none animate-living-glide"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1920&q=80')",
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Ambient Drifting Golden Sun Rays */}
        <div className="absolute -top-32 -right-20 w-[600px] h-[500px] bg-gradient-to-b from-orange-400/25 via-amber-300/15 to-transparent pointer-events-none filter blur-3xl animate-beam-drift" />

        {/* Floating Soft Ambient Glow */}
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-3xl pointer-events-none float-subtle" />
      </div>

      {/* Kinetic Scroll Progress Bar */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Pop-up Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${isSidebarPinned ? 'lg:pl-72' : 'pl-0'}`}>
        {/* Sticky Top Navbar */}
        <TopNav />

        {/* Dynamic Page Views with Landing Page Entrance Animation */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-20 lg:pb-12">
          <div key={`${currentPortal}-${activeTab}`} className="animate-page-reveal w-full">
            {renderContentView()}
          </div>
        </main>
      </div>

      {/* Floating Scroll-to-Top Indicator when scrolling up */}
      {isScrollingUp && scrollProgress > 10 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 lg:bottom-8 right-6 z-40 p-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 group border border-orange-400/40"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <ServiceDetailsModal />
      <AadhaarLinkModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
