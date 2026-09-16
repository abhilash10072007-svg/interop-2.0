import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_SERVICES, 
  SERVICE_CATEGORIES,
  INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CONSENTS, 
  CONSENT_HISTORY 
} from '../data/mockData';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Portal & Role Switching (Citizen, Officer, Admin) - No Auth Gate
  const [currentPortal, setCurrentPortal] = useState('citizen'); // 'citizen' | 'officer' | 'admin'
  const [citizenId, setCitizenId] = useState('C001');
  const [officerId, setOfficerId] = useState('U002');

  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  // Backend Connectivity State
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'

  // Live Backend Data States
  const [unifiedData, setUnifiedData] = useState(null);
  const [citizenDashboardData, setCitizenDashboardData] = useState(null);
  const [reconciliationData, setReconciliationData] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [adminDashboardData, setAdminDashboardData] = useState(null);
  const [healthData, setHealthData] = useState(null);

  // User Profile (auto-populated from FastAPI / Supabase)
  const [user, setUser] = useState({
    name: 'Gokul (C001)',
    citizenId: 'C001',
    email: 'gokul@interop.gov.in',
    mobile: '+91 98765 43210',
    dob: '2007-05-04',
    gender: 'Male',
    aadhaarNumber: 'XXXX-XXXX-4021',
    address: 'Coimbatore, Tamil Nadu',
    initials: 'G'
  });

  // Services & Categories
  const [services] = useState(INITIAL_SERVICES);
  const [categories] = useState(SERVICE_CATEGORIES);

  // Applications, Notifications, Consents
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [consents, setConsents] = useState(INITIAL_CONSENTS);
  const [consentHistory, setConsentHistory] = useState(CONSENT_HISTORY);

  // Modals & UI Selection
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', title = '') => {
    setToast({ message, type, title });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Helper to map backend applications to frontend structure
  const mapBackendApps = (apps) => {
    if (!Array.isArray(apps)) return [];
    return apps.map((app, idx) => {
      const rawStatus = (app.application_status || 'SUBMITTED').toUpperCase();
      let statusLabel = 'In Progress';
      let currentStep = 'Under Review';

      if (rawStatus === 'APPROVED') {
        statusLabel = 'Approved';
        currentStep = 'Digital Delivery';
      } else if (rawStatus === 'REJECTED') {
        statusLabel = 'Rejected';
        currentStep = 'Rejected by Reviewer';
      } else if (rawStatus === 'SUBMITTED') {
        statusLabel = 'In Progress';
        currentStep = 'Submitted & Queued';
      } else if (rawStatus === 'UNDER_REVIEW') {
        statusLabel = 'In Progress';
        currentStep = 'Department Officer Review';
      }

      return {
        id: app.application_id || `APP-${idx + 1}`,
        rawStatus: rawStatus,
        serviceName: app.scheme_name || 'Education Scholarship',
        serviceCategory: 'Social Welfare & Education',
        appliedOn: app.submitted_on || 'Today',
        status: statusLabel,
        currentStep: currentStep,
        department: 'Welfare Department',
        applicantName: app.applicant_name || 'Citizen',
        applicantRef: app.applicant_ref || citizenId,
        birthDate: app.birth_date || '--',
        riskScore: 'Low (0.02)',
        ocrDetails: { nameMatch: '100%', faceMatch: '98.5%' },
        updatedAt: 'Recently',
        steps: [
          { name: 'Application Submitted', status: 'completed', date: app.submitted_on || 'Day 1' },
          { 
            name: 'Document & Consent Verification', 
            status: rawStatus !== 'SUBMITTED' ? 'completed' : 'current', 
            date: rawStatus !== 'SUBMITTED' ? 'Verified' : 'In Progress' 
          },
          { 
            name: 'Department Officer Approval', 
            status: rawStatus === 'APPROVED' ? 'completed' : rawStatus === 'REJECTED' ? 'rejected' : rawStatus === 'UNDER_REVIEW' ? 'current' : 'pending', 
            date: rawStatus === 'APPROVED' ? 'Approved by U002' : rawStatus === 'REJECTED' ? 'Rejected' : rawStatus === 'UNDER_REVIEW' ? 'Reviewing' : '--' 
          },
          { 
            name: 'Digital Certificate / Scheme Issuance', 
            status: rawStatus === 'APPROVED' ? 'completed' : 'pending', 
            date: rawStatus === 'APPROVED' ? 'Issued' : '--' 
          }
        ]
      };
    });
  };

  // Main Data Refresh function from FastAPI backend
  const refreshBackendData = useCallback(async (targetCitizenId = citizenId) => {
    try {
      const health = await api.checkBackendHealth();
      if (!health.online) {
        setIsBackendConnected(false);
        setBackendStatus('offline');
        return;
      }

      setIsBackendConnected(true);
      setBackendStatus('connected');

      // 1. Fetch Unified Citizen Record
      try {
        const unifiedRes = await api.getCitizenUnified(targetCitizenId);
        if (unifiedRes && unifiedRes.unified_citizen_record) {
          setUnifiedData(unifiedRes.unified_citizen_record);
          const c = unifiedRes.unified_citizen_record.citizen;
          if (c) {
            setUser(prev => ({
              ...prev,
              name: c.name || `Citizen (${targetCitizenId})`,
              citizenId: targetCitizenId,
              dob: c.dob || prev.dob,
              gender: c.gender || prev.gender,
              address: c.address || prev.address,
              initials: (c.name || 'C').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            }));
          }
        }
      } catch (err) {
        console.warn('Unified record fetch notice:', err.message);
      }

      // 2. Fetch Dashboard & Applications
      try {
        const dashRes = await api.getCitizenDashboard(targetCitizenId);
        if (dashRes) {
          setCitizenDashboardData(dashRes);
          if (Array.isArray(dashRes.applications) && dashRes.applications.length > 0) {
            setApplications(mapBackendApps(dashRes.applications));
          } else {
            // Check direct applications endpoint
            const appsRes = await api.getCitizenApplications(targetCitizenId);
            if (appsRes && Array.isArray(appsRes.applications) && appsRes.applications.length > 0) {
              setApplications(mapBackendApps(appsRes.applications));
            }
          }

          if (Array.isArray(dashRes.notifications) && dashRes.notifications.length > 0) {
            const mappedNotifs = dashRes.notifications.map(n => ({
              id: n.notification_id || `NOT-${Math.random()}`,
              title: (n.event_type || 'Update').replace(/_/g, ' '),
              message: n.message,
              time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
              type: n.event_type?.includes('APPROVED') ? 'success' : n.event_type?.includes('REJECTED') ? 'warning' : 'system',
              read: n.read_status === 'READ',
              category: 'update'
            }));
            setNotifications(mappedNotifs);
          }
        }
      } catch (err) {
        console.warn('Dashboard fetch notice:', err.message);
      }

      // 3. Fetch Reconciliation Data (DOB conflict detection)
      try {
        const reconRes = await api.getReconciliation(targetCitizenId);
        if (reconRes && reconRes.reconciliation_report) {
          setReconciliationData(reconRes.reconciliation_report);
        }
      } catch (err) {
        console.warn('Reconciliation fetch notice:', err.message);
      }

      // 4. Check Eligibility for Education Scholarship
      try {
        const eligRes = await api.checkEligibility(targetCitizenId, 'Education Scholarship');
        if (eligRes) {
          setEligibilityData(eligRes);
        }
      } catch (err) {
        console.warn('Eligibility fetch notice:', err.message);
      }

      // 5. Fetch Audit Logs
      try {
        const auditRes = await api.getAuditLogs(targetCitizenId);
        if (auditRes && Array.isArray(auditRes.audit_logs)) {
          setAuditLogs(auditRes.audit_logs);
          if (auditRes.audit_logs.length > 0) {
            const mappedHistory = auditRes.audit_logs.map((log, idx) => ({
              id: log.log_id || `LOG-${idx}`,
              action: (log.action || 'Data Access').replace(/_/g, ' '),
              department: log.data_provider || log.target_table || 'GovSync InterOp',
              date: log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent',
              status: 'Verified'
            }));
            setConsentHistory(mappedHistory);
          }
        }
      } catch (err) {
        console.warn('Audit logs fetch notice:', err.message);
      }

      // 6. Fetch Admin Dashboard & Health
      try {
        const [admDash, hltDept] = await Promise.all([
          api.getAdminDashboard().catch(() => null),
          api.getHealthDepartments().catch(() => null)
        ]);
        if (admDash) setAdminDashboardData(admDash);
        if (hltDept) setHealthData(hltDept);
      } catch (err) {
        console.warn('Admin stats fetch notice:', err.message);
      }

    } catch (err) {
      console.warn('Backend sync failed:', err);
      setIsBackendConnected(false);
      setBackendStatus('offline');
    }
  }, [citizenId]);

  // Periodic and initial sync
  useEffect(() => {
    refreshBackendData(citizenId);
    const timer = setInterval(() => {
      refreshBackendData(citizenId);
    }, 15000);
    return () => clearInterval(timer);
  }, [refreshBackendData, citizenId]);

  // Quick switch citizen handler
  const handleSwitchCitizen = (newCitizenId) => {
    const cleanId = (newCitizenId || '').trim().toUpperCase();
    if (!cleanId) return;
    setCitizenId(cleanId);
    showToast(`Switched active citizen context to ${cleanId}`, 'info', 'Citizen Switched');
    refreshBackendData(cleanId);
  };

  // Grant Consent handler
  const handleGrantConsent = async (dataProvider, dataType, purpose) => {
    try {
      const res = await api.grantConsent(citizenId, dataProvider, dataType, purpose);
      showToast(`Consent granted for ${dataProvider} (${dataType})`, 'success', 'Consent Granted');
      refreshBackendData(citizenId);
      return res;
    } catch (err) {
      showToast(`Failed to grant consent: ${err.message}`, 'error', 'Error');
      throw err;
    }
  };

  // Toggle consent switch & propagate to FastAPI
  const handleToggleConsent = async (id) => {
    const target = consents.find(item => item.id === id);
    const nextState = target ? !target.enabled : false;

    if (isBackendConnected && target) {
      try {
        if (nextState) {
          await api.grantConsent(
            citizenId,
            target.department || 'Education Department',
            target.category || 'Education',
            'Education Scholarship'
          );
        }
      } catch (err) {
        console.warn('Consent sync to backend error:', err);
      }
    }

    setConsents(prev => prev.map(item => {
      if (item.id === id) {
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

  // Submit Application with full backend consent + eligibility validation
  const handleCreateApplication = async (formData) => {
    const schemeName = formData.serviceName || 'Education Scholarship';

    if (isBackendConnected) {
      try {
        // Attempt submit
        let res = await api.submitApplication(citizenId, schemeName);

        // If consent is missing, offer auto-granting consent for seamless demo experience!
        if (res && !res.application_submitted && res.message?.toLowerCase().includes('consent')) {
          showToast('Granting required Education & Income consents automatically...', 'info', 'Auto-Granting Consent');
          await api.grantConsent(citizenId, 'Education Department', 'Education', schemeName);
          await api.grantConsent(citizenId, 'Income Department', 'Income', schemeName);
          
          // Re-attempt submit
          res = await api.submitApplication(citizenId, schemeName);
        }

        if (res && res.application_submitted) {
          showToast(`Application ${res.application?.application_id || 'submitted'} created successfully!`, 'success', 'Application Submitted');
          triggerConfetti();
          await refreshBackendData(citizenId);
          setActiveTab('tracking');
          return res;
        } else if (res && !res.application_submitted) {
          showToast(res.message || 'Eligibility check failed', 'warning', 'Notice');
          return res;
        }
      } catch (err) {
        console.warn('Backend application submit error:', err);
        showToast(`Backend submission error: ${err.message}`, 'error', 'Error');
      }
    }

    // Local fallback
    const tempId = 'APP-' + Math.floor(10000 + Math.random() * 90000);
    const newApp = {
      id: tempId,
      rawStatus: 'SUBMITTED',
      serviceName: schemeName,
      serviceCategory: 'Social Welfare & Education',
      appliedOn: 'Today',
      currentStep: 'Submitted & Queued',
      status: 'In Progress',
      department: 'Welfare Department',
      applicantName: user.name,
      applicantRef: citizenId,
      birthDate: user.dob,
      riskScore: 'Low (0.02)',
      ocrDetails: { nameMatch: '100%', faceMatch: '98.5%' },
      updatedAt: 'Just now',
      steps: [
        { name: 'Application Submitted', status: 'completed', date: 'Just now' },
        { name: 'Document Verification', status: 'current', date: 'In Progress' },
        { name: 'Department Officer Approval', status: 'pending', date: '--' },
        { name: 'Digital Delivery', status: 'pending', date: '--' }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    showToast(`Application ${tempId} recorded locally!`, 'success', 'Submitted');
    triggerConfetti();
    setActiveTab('tracking');
  };

  // Officer Status Update Workflow
  const handleOfficerUpdateStatus = async (applicationId, newStatus) => {
    if (!isBackendConnected) {
      setApplications(prev => prev.map(a => {
        if (a.id === applicationId) {
          return {
            ...a,
            rawStatus: newStatus,
            status: newStatus === 'APPROVED' ? 'Approved' : newStatus === 'REJECTED' ? 'Rejected' : 'In Progress'
          };
        }
        return a;
      }));
      showToast(`Application ${applicationId} marked as ${newStatus} (Local)`, 'success', 'Status Updated');
      return;
    }

    try {
      const res = await api.updateApplicationStatus(applicationId, officerId, newStatus);
      if (res && res.status_updated) {
        showToast(`Application ${applicationId} status updated to ${newStatus}`, 'success', 'Status Updated');
        triggerConfetti();
        await refreshBackendData(citizenId);
      } else {
        showToast(res.message || 'Status update transition failed', 'warning', 'Workflow Transition');
      }
    } catch (err) {
      showToast(`Officer update error: ${err.message}`, 'error', 'Error');
    }
  };

  const handleOfficerApproveApp = async (applicationId) => {
    // If current status is SUBMITTED, backend requires transition to UNDER_REVIEW first, then APPROVED
    const targetApp = applications.find(a => a.id === applicationId);
    if (targetApp && targetApp.rawStatus === 'SUBMITTED') {
      try {
        await api.updateApplicationStatus(applicationId, officerId, 'UNDER_REVIEW');
      } catch (e) {
        console.warn('Intermediate transition notice:', e);
      }
    }
    await handleOfficerUpdateStatus(applicationId, 'APPROVED');
  };

  const handleOfficerRejectApp = async (applicationId) => {
    const targetApp = applications.find(a => a.id === applicationId);
    if (targetApp && targetApp.rawStatus === 'SUBMITTED') {
      try {
        await api.updateApplicationStatus(applicationId, officerId, 'UNDER_REVIEW');
      } catch (e) {
        console.warn('Intermediate transition notice:', e);
      }
    }
    await handleOfficerUpdateStatus(applicationId, 'REJECTED');
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider value={{
      // Prototype Portal & Role Switching
      currentPortal,
      setCurrentPortal,
      citizenId,
      setCitizenId,
      handleSwitchCitizen,
      officerId,
      setOfficerId,

      // Navigation & Layout
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

      // Live Backend State
      isBackendConnected,
      backendStatus,
      refreshBackendData,
      unifiedData,
      citizenDashboardData,
      reconciliationData,
      eligibilityData,
      auditLogs,
      adminDashboardData,
      healthData,

      // User & Entity State
      user,
      setUser,
      services,
      categories,
      applications,
      notifications,
      consents,
      consentHistory,

      // Modal & Notification State
      selectedServiceModal,
      setSelectedServiceModal,
      selectedApplicationDetails,
      setSelectedApplicationDetails,
      isAadhaarModalOpen,
      setIsAadhaarModalOpen,
      toast,
      showToast,
      triggerConfetti,

      // Business Logic Actions
      handleToggleConsent,
      handleGrantConsent,
      handleCreateApplication,
      handleOfficerUpdateStatus,
      handleOfficerApproveApp,
      handleOfficerRejectApp,
      handleMarkNotificationRead,
      handleMarkAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
