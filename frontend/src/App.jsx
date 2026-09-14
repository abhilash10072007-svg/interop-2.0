import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './components/citizen/Dashboard';
import { Services } from './components/citizen/Services';
import { ApplicationForm } from './components/citizen/ApplicationForm';
import { ApplicationTracking } from './components/citizen/ApplicationTracking';
import { ConsentManagement } from './components/citizen/ConsentManagement';
import { NotificationsPage } from './components/citizen/NotificationsPage';
import { Profile } from './components/citizen/Profile';
import { ServiceDetailsModal } from './components/citizen/ServiceDetailsModal';
import { AadhaarLinkModal } from './components/citizen/AadhaarLinkModal';
import { Login } from './components/auth/Login';
import { OtpVerification } from './components/auth/OtpVerification';
import { ArrowUp } from 'lucide-react';
import { Toast } from './components/common/Toast';
import { useScrollAnimation } from './hooks/useScrollAnimation';

const MainLayout = () => {
  const { activeTab, isAuthenticated, authView, isSidebarPinned } = useApp();
  const { scrollProgress, isScrollingUp } = useScrollAnimation();

  // If user is unauthenticated, render Auth Flow
  if (!isAuthenticated) {
    if (authView === 'otp') {
      return <OtpVerification />;
    }
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Kinetic Scroll Progress Bar */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress}%` }} 
      />

      {/* Pop-up Sidebar (pops up when requested) */}
      <Sidebar />

      {/* Main Content Area (full width by default, pops up on wish) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarPinned ? 'lg:pl-72' : 'pl-0'}`}>
        {/* Sticky Top Navbar */}
        <TopNav />

        {/* Dynamic Page Views with Landing Page Entrance Animation */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-20 lg:pb-12">
          <div key={activeTab} className="animate-page-reveal w-full">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'services' && <Services />}
            {activeTab === 'apply' && <ApplicationForm />}
            {activeTab === 'applications' && <ApplicationTracking />}
            {activeTab === 'tracking' && <ApplicationTracking />}
            {activeTab === 'consent' && <ConsentManagement />}
            {activeTab === 'notifications' && <NotificationsPage />}
            {activeTab === 'profile' && <Profile />}
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

      {/* Mobile Bottom Navigation (Screen 9) */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <ServiceDetailsModal />
      <AadhaarLinkModal />
      <Toast />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
