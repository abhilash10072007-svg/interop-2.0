import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_SERVICES, 
  SERVICE_CATEGORIES,
  INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CONSENTS, 
  CONSENT_HISTORY 
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation states: 'dashboard', 'services', 'apply', 'applications', 'tracking', 'consent', 'notifications', 'profile'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  // Auth State (true by default to display dashboard directly, can toggle to login/otp)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' or 'otp'
  const [authMethod, setAuthMethod] = useState('mobile'); // 'mobile', 'aadhaar', 'email'
  const [authCredential, setAuthCredential] = useState('+91 98765 43210');

  // User Profile
  const [user, setUser] = useState({
    name: 'Arjun Kumar',
    citizenId: 'CZN-2025-00123',
    email: 'arjun.kumar@email.com',
    mobile: '+91 98765 43210',
    dob: '12-08-1996',
    gender: 'Male',
    aadhaarNumber: 'XXXX-XXXX-4021',
    address: 'No. 12, MG Road, Coimbatore, Tamil Nadu - 641001',
    initials: 'AK'
  });

  // Dynamic state arrays
  const [services] = useState(INITIAL_SERVICES);
  const [categories] = useState(SERVICE_CATEGORIES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [consents, setConsents] = useState(INITIAL_CONSENTS);
  const [consentHistory, setConsentHistory] = useState(CONSENT_HISTORY);

  // Modal States
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // Toggle consent switch
  const handleToggleConsent = (id) => {
    setConsents(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.enabled;
        showToast(
          `${item.name} is now ${nextState ? 'Active' : 'Paused'}.`,
          nextState ? 'success' : 'info',
          'Consent Updated'
        );
        return { ...item, enabled: nextState };
      }
      return item;
    }));
  };

  // Create new application
  const handleCreateApplication = (formData) => {
    const newId = `DL-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApp = {
      id: newId,
      serviceName: formData.serviceName || 'Driving License',
      serviceCategory: 'Transport & Vehicles',
      appliedOn: 'Today',
      currentStep: 'Verification',
      status: 'In Progress',
      department: 'Transport Department',
      updatedAt: 'Just now',
      steps: [
        { name: 'Application Submitted', status: 'completed', date: 'Just now' },
        { name: 'Document Verification', status: 'current', date: 'In Progress' },
        { name: 'Department Officer Approval', status: 'pending', date: '--' },
        { name: 'Digital Delivery', status: 'pending', date: '--' }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    showToast(`Application ${newId} submitted successfully!`, 'success', 'Submitted');
    triggerConfetti();
    setActiveTab('tracking');
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
    showToast('You have been logged out securely.', 'info');
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      isSidebarOpen,
      setIsSidebarOpen,
      isSidebarPinned,
      setIsSidebarPinned,
      isAuthenticated,
      setIsAuthenticated,
      authView,
      setAuthView,
      authMethod,
      setAuthMethod,
      authCredential,
      setAuthCredential,
      user,
      setUser,
      services,
      categories,
      applications,
      notifications,
      consents,
      consentHistory,
      selectedServiceModal,
      setSelectedServiceModal,
      selectedApplicationDetails,
      setSelectedApplicationDetails,
      isAadhaarModalOpen,
      setIsAadhaarModalOpen,
      toast,
      showToast,
      triggerConfetti,
      handleToggleConsent,
      handleCreateApplication,
      handleMarkNotificationRead,
      handleMarkAllNotificationsRead,
      handleLogout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
