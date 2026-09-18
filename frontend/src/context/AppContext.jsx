import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import confetti from 'canvas-confetti';

import {
  INITIAL_SERVICES,
  SERVICE_CATEGORIES,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONSENTS,
  CONSENT_HISTORY,
} from '../data/mockData';

import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

  // ============================================================
  // PORTAL / SESSION
  // ============================================================

  const [currentPortal, setCurrentPortal] =
    useState('citizen');

  const [citizenId, setCitizenId] =
    useState(null);

  const [officerId, setOfficerId] =
    useState('U002');


  // ============================================================
  // NAVIGATION
  // ============================================================

  const [activeTab, setActiveTab] =
    useState('dashboard');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSidebarPinned, setIsSidebarPinned] =
    useState(false);


  // ============================================================
  // BACKEND CONNECTION
  // ============================================================

  const [isBackendConnected, setIsBackendConnected] =
    useState(false);

  const [backendStatus, setBackendStatus] =
    useState('checking');

  const [isLoadingCitizen, setIsLoadingCitizen] =
    useState(false);


  // ============================================================
  // LIVE BACKEND DATA
  // ============================================================

  const [unifiedData, setUnifiedData] =
    useState(null);

  const [citizenDashboardData, setCitizenDashboardData] =
    useState(null);

  const [reconciliationData, setReconciliationData] =
    useState(null);

  const [eligibilityData, setEligibilityData] =
    useState(null);


  // ============================================================
  // PENDING APPLICATION
  // ============================================================

  const [pendingApplication, setPendingApplication] =
    useState(null);

  const [
    pendingApplicationMissingConsents,
    setPendingApplicationMissingConsents
  ] = useState([]);


  // ============================================================
  // AUDIT / ADMIN / HEALTH
  // ============================================================

  const [auditLogs, setAuditLogs] =
    useState([]);

  const [adminDashboardData, setAdminDashboardData] =
    useState(null);

  const [healthData, setHealthData] =
    useState(null);


  // ============================================================
  // USER PROFILE
  // ============================================================

  const [user, setUser] =
    useState(null);


  // ============================================================
  // STATIC SERVICE CONFIGURATION
  // ============================================================

  const [services] =
    useState(
      Array.isArray(INITIAL_SERVICES)
        ? INITIAL_SERVICES
        : []
    );

  const [categories] =
    useState(
      Array.isArray(SERVICE_CATEGORIES)
        ? SERVICE_CATEGORIES
        : []
    );


  // ============================================================
  // APPLICATIONS / NOTIFICATIONS / CONSENTS
  // ============================================================

  const [applications, setApplications] =
    useState(
      Array.isArray(INITIAL_APPLICATIONS)
        ? INITIAL_APPLICATIONS
        : []
    );

  const [notifications, setNotifications] =
    useState(
      Array.isArray(INITIAL_NOTIFICATIONS)
        ? INITIAL_NOTIFICATIONS
        : []
    );

  const [consents, setConsents] =
    useState(
      Array.isArray(INITIAL_CONSENTS)
        ? INITIAL_CONSENTS
        : []
    );

  const [consentHistory, setConsentHistory] =
    useState(
      Array.isArray(CONSENT_HISTORY)
        ? CONSENT_HISTORY
        : []
    );


  // ============================================================
  // UI / MODALS
  // ============================================================

  const [selectedServiceModal, setSelectedServiceModal] =
    useState(null);

  const [
    selectedApplicationDetails,
    setSelectedApplicationDetails
  ] = useState(null);

  const [isAadhaarModalOpen, setIsAadhaarModalOpen] =
    useState(false);

  const [toast, setToast] =
    useState(null);


  // ============================================================
  // TOAST
  // ============================================================

  const showToast = useCallback(
    (
      message,
      type = 'success',
      title = ''
    ) => {

      setToast({
        message,
        type,
        title,
      });

      setTimeout(() => {
        setToast(null);
      }, 4500);

    },
    []
  );


  // ============================================================
  // CONFETTI
  // ============================================================

  const triggerConfetti = useCallback(() => {

    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        y: 0.6,
      },
    });

  }, []);


  // ============================================================
  // MAP BACKEND APPLICATIONS
  // ============================================================

  const mapBackendApps = useCallback(
    (apps) => {

      if (!Array.isArray(apps)) {
        return [];
      }

      return apps.map(
        (app, index) => {

          const rawStatus =
            String(
              app.application_status ||
              'SUBMITTED'
            ).toUpperCase();


          // ------------------------------------------------------
          // STATUS
          // ------------------------------------------------------

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

            currentStep =
              'Department Officer Review';

          } else if (rawStatus === 'UNDER_VERIFICATION') {

            statusLabel = 'In Progress';

            currentStep =
              'Document & Consent Verification';

          }


          // ------------------------------------------------------
          // SERVICE CATEGORY
          // ------------------------------------------------------

          let serviceCategory =
            app.service_category;


          if (!serviceCategory) {

            if (
              app.scheme_name ===
                'Driving License' ||
              app.scheme_name ===
                'Vehicle Registration'
            ) {

              serviceCategory =
                'Transport & Vehicles';

            } else if (
              app.scheme_name ===
              'Income Certificate'
            ) {

              serviceCategory =
                'Revenue & Land Administration';

            } else if (
              app.scheme_name ===
              'Caste Certificate'
            ) {

              serviceCategory =
                'Backward Classes & Community Welfare';

            } else if (
              app.scheme_name ===
              'Personal Loan'
            ) {

              serviceCategory =
                'Public Financial Institutions Network';

            } else {

              serviceCategory =
                'Social Welfare & Education';

            }

          }


          // ------------------------------------------------------
          // DEPARTMENT
          // ------------------------------------------------------

          let department =
            'Welfare Department';


          if (
            serviceCategory ===
            'Transport & Vehicles'
          ) {

            department =
              'Transport Department';

          } else if (
            serviceCategory ===
            'Revenue & Land Administration'
          ) {

            department =
              'Revenue Department';

          } else if (
            serviceCategory ===
            'Backward Classes & Community Welfare'
          ) {

            department =
              'Backward Classes & Community Welfare Department';

          } else if (
            serviceCategory ===
            'Public Financial Institutions Network'
          ) {

            department =
              'Public Financial Institutions Network';

          }


          // ------------------------------------------------------
          // APPLICATION STEPS
          // ------------------------------------------------------

          const steps = [

            {
              name:
                'Application Submitted',

              status:
                'completed',

              date:
                app.submitted_on ||
                'Day 1',
            },


            {
              name:
                'Document & Consent Verification',

              status:
                rawStatus ===
                'SUBMITTED'
                  ? 'current'
                  : rawStatus ===
                    'UNDER_VERIFICATION'
                  ? 'current'
                  : rawStatus ===
                    'REJECTED'
                  ? 'completed'
                  : 'completed',

              date:
                rawStatus ===
                  'SUBMITTED' ||
                rawStatus ===
                  'UNDER_VERIFICATION'
                  ? 'In Progress'
                  : 'Verified',
            },


            {
              name:
                'Department Officer Approval',

              status:
                rawStatus ===
                'APPROVED'
                  ? 'completed'
                  : rawStatus ===
                    'REJECTED'
                  ? 'rejected'
                  : rawStatus ===
                    'UNDER_REVIEW'
                  ? 'current'
                  : 'pending',

              date:
                rawStatus ===
                'APPROVED'
                  ? 'Approved'
                  : rawStatus ===
                    'REJECTED'
                  ? 'Rejected'
                  : rawStatus ===
                    'UNDER_REVIEW'
                  ? 'Reviewing'
                  : '--',
            },


            {
              name:
                'Digital Certificate / Scheme Issuance',

              status:
                rawStatus ===
                'APPROVED'
                  ? 'completed'
                  : 'pending',

              date:
                rawStatus ===
                'APPROVED'
                  ? 'Issued'
                  : '--',
            },

          ];


          // ------------------------------------------------------
          // RETURN MAPPED APPLICATION
          // ------------------------------------------------------

          return {

            id:
              app.application_id ||
              `APP-${index + 1}`,

            rawStatus,

            operation:
              app.operation ||
              'APPLY',

            serviceName:
              app.scheme_name ||
              'Education Scholarship',

            serviceCategory,

            appliedOn:
              app.submitted_on ||
              'Today',

            status:
              statusLabel,

            currentStep,

            department,

            applicantName:
              app.applicant_name ||
              'Citizen',

            applicantRef:
              app.applicant_ref ||
              citizenId,

            birthDate:
              app.birth_date ||
              '--',

            updatedAt:
              'Recently',

            steps,

          };

        }
      );

    },
    [citizenId]
  );


  // ============================================================
  // CLEAR CITIZEN DATA
  // ============================================================

  const clearCitizenData = useCallback(() => {

    setUnifiedData(null);

    setCitizenDashboardData(null);

    setReconciliationData(null);

    setEligibilityData(null);

    setPendingApplication(null);

    setPendingApplicationMissingConsents([]);

    setAuditLogs([]);

    setApplications([]);

    setNotifications([]);

    setConsents([]);

    setConsentHistory([]);

    setUser(null);

    setSelectedApplicationDetails(null);

  }, []);


  // ============================================================
  // REFRESH BACKEND DATA
  // ============================================================

  const refreshBackendData = useCallback(
    async (targetCitizenId) => {

      const cleanCitizenId =
        String(
          targetCitizenId || ''
        ).trim();


      if (!cleanCitizenId) {
        return;
      }


      setIsLoadingCitizen(true);


      try {

        // ======================================================
        // 1. BACKEND HEALTH
        // ======================================================

        const health =
          await api.checkBackendHealth();


        if (!health?.online) {

          setIsBackendConnected(false);

          setBackendStatus('offline');

          return;
        }


        setIsBackendConnected(true);

        setBackendStatus('connected');


        // ======================================================
        // 2. UNIFIED CITIZEN RECORD
        // ======================================================

        try {

          const unifiedRes =
            await api.getCitizenUnified(
              cleanCitizenId
            );


          console.log(
            'LIVE UNIFIED RESPONSE:',
            unifiedRes
          );


          if (unifiedRes) {

            const record =
              unifiedRes.unified_citizen_record ||
              unifiedRes;


            setUnifiedData(record);


            const citizen =
              record.citizen;


            if (citizen) {

              setUser(
                (previous) => ({

                  ...(previous || {}),

                  name:
                    citizen.name ||
                    `Citizen (${cleanCitizenId})`,

                  citizenId:
                    citizen.citizen_id ||
                    cleanCitizenId,

                  dob:
                    citizen.dob ||
                    '',

                  gender:
                    citizen.gender ||
                    '',

                  address:
                    citizen.address ||
                    '',

                  mobile:
                    citizen.phone ||
                    '',

                  phone:
                    citizen.phone ||
                    '',

                  initials:
                    (
                      citizen.name ||
                      'C'
                    )
                      .split(' ')
                      .map(
                        (word) =>
                          word[0]
                      )
                      .join('')
                      .slice(0, 2)
                      .toUpperCase(),

                })
              );

            }

          }

        } catch (error) {

          console.warn(
            'Unified record fetch notice:',
            error.message
          );

        }


        // ======================================================
        // 3. CITIZEN DASHBOARD
        // ======================================================

        try {

          const dashRes =
            await api.getCitizenDashboard(
              cleanCitizenId
            );


          console.log(
            'LIVE DASHBOARD RESPONSE:',
            dashRes
          );


          if (dashRes) {

            setCitizenDashboardData(
              dashRes
            );


            // --------------------------------------------------
            // APPLICATIONS
            // --------------------------------------------------

            if (
              Array.isArray(
                dashRes.applications
              )
            ) {

              console.log(
                'APPLICATIONS FROM DASHBOARD:',
                dashRes.applications
              );


              const mappedApplications =
                mapBackendApps(
                  dashRes.applications
                );


              console.log(
                'MAPPED APPLICATIONS:',
                mappedApplications
              );


              setApplications(
                mappedApplications
              );

            }


            // --------------------------------------------------
            // NOTIFICATIONS
            // --------------------------------------------------

            if (
              Array.isArray(
                dashRes.notifications
              )
            ) {

              const mappedNotifications =
                dashRes.notifications.map(
                  (
                    notification,
                    index
                  ) => {

                    const eventType =
                      String(
                        notification.event_type ||
                        ''
                      ).toUpperCase();


                    return {

                      id:
                        notification.notification_id ||
                        `NOT-${index}`,

                      title:
                        String(
                          notification.event_type ||
                          'Update'
                        ).replace(
                          /_/g,
                          ' '
                        ),

                      message:
                        notification.message ||
                        'System update',

                      time:
                        notification.created_at
                          ? new Date(
                              notification.created_at
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )
                          : 'Recent',

                      type:
                        eventType.includes(
                          'APPROVED'
                        )
                          ? 'success'
                          : eventType.includes(
                              'REJECTED'
                            )
                          ? 'warning'
                          : 'system',

                      read:
                        String(
                          notification.read_status ||
                          ''
                        ).toUpperCase() ===
                        'READ',

                      category:
                        'update',

                    };

                  }
                );


              setNotifications(
                mappedNotifications
              );

            }


            // --------------------------------------------------
            // CONSENTS
            // --------------------------------------------------

            if (
              Array.isArray(
                dashRes.consents
              )
            ) {

              setConsents(
                dashRes.consents
              );

            }

          }


        } catch (error) {

          console.warn(
            'Dashboard fetch notice:',
            error.message
          );


          // ====================================================
          // FALLBACK: DIRECT APPLICATION FETCH
          // ====================================================

          try {

            console.log(
              'Dashboard failed — fetching applications directly...'
            );


            const applicationsRes =
              await api.getCitizenApplications(
                cleanCitizenId
              );


            console.log(
              'DIRECT APPLICATIONS RESPONSE:',
              applicationsRes
            );


            if (
              applicationsRes &&
              Array.isArray(
                applicationsRes.applications
              )
            ) {

              const mappedApplications =
                mapBackendApps(
                  applicationsRes.applications
                );


              console.log(
                'DIRECT APPLICATIONS MAPPED:',
                mappedApplications
              );


              setApplications(
                mappedApplications
              );

            }

          } catch (applicationsError) {

            console.error(
              'Direct applications fetch failed:',
              applicationsError
            );

          }

        }


        // ======================================================
        // 4. RECONCILIATION
        // ======================================================

        try {

          const reconRes =
            await api.getReconciliation(
              cleanCitizenId
            );


          console.log(
            'LIVE RECONCILIATION RESPONSE:',
            reconRes
          );


          if (reconRes) {

            setReconciliationData(
              reconRes
            );

          }

        } catch (error) {

          console.warn(
            'Reconciliation fetch notice:',
            error.message
          );

        }


        // ======================================================
        // 5. ELIGIBILITY
        // ======================================================

        try {

          const eligibilityRes =
            await api.checkEligibility(
              cleanCitizenId,
              'Education Scholarship'
            );


          console.log(
            'LIVE ELIGIBILITY RESPONSE:',
            eligibilityRes
          );


          if (eligibilityRes) {

            setEligibilityData(
              eligibilityRes
            );

          }

        } catch (error) {

          console.warn(
            'Eligibility fetch notice:',
            error.message
          );

        }


        // ======================================================
        // 6. AUDIT LOGS
        // ======================================================

        try {

          const auditRes =
            await api.getAuditLogs(
              cleanCitizenId
            );


          console.log(
            'LIVE AUDIT RESPONSE:',
            auditRes
          );


          if (
            auditRes &&
            Array.isArray(
              auditRes.audit_logs
            )
          ) {

            setAuditLogs(
              auditRes.audit_logs
            );


            const history =
              auditRes.audit_logs.map(
                (
                  log,
                  index
                ) => ({

                  id:
                    log.log_id ||
                    `LOG-${index}`,

                  action:
                    String(
                      log.action ||
                      'Data Access'
                    ).replace(
                      /_/g,
                      ' '
                    ),

                  department:
                    log.data_provider ||
                    log.target_table ||
                    'GovSync InterOp',

                  date:
                    log.timestamp
                      ? new Date(
                          log.timestamp
                        ).toLocaleString()
                      : 'Recent',

                  status:
                    'Verified',

                })
              );


            if (
              history.length > 0
            ) {

              setConsentHistory(
                history
              );

            }

          }

        } catch (error) {

          console.warn(
            'Audit logs fetch notice:',
            error.message
          );

        }


        // ======================================================
        // 7. ADMIN + DEPARTMENT HEALTH
        // ======================================================

        try {

          const [
            adminResponse,
            healthResponse,
          ] = await Promise.all([

            api
              .getAdminDashboard()
              .catch(
                () => null
              ),

            api
              .getHealthDepartments()
              .catch(
                () => null
              ),

          ]);


          if (adminResponse) {

            setAdminDashboardData(
              adminResponse
            );

          }


          if (healthResponse) {

            setHealthData(
              healthResponse
            );

          }

        } catch (error) {

          console.warn(
            'Admin/health fetch notice:',
            error.message
          );

        }

      } catch (error) {

        console.error(
          'Backend refresh failed:',
          error
        );


        setIsBackendConnected(false);

        setBackendStatus('offline');

      } finally {

        setIsLoadingCitizen(false);

      }

    },
    [
      mapBackendApps,
    ]
  );


  // ============================================================
  // CITIZEN LOGIN
  // ============================================================

  const handleCitizenLogin =
    useCallback(
      async (mobile) => {

        const cleanMobile =
          String(
            mobile || ''
          ).trim();


        if (!cleanMobile) {

          showToast(
            'Please enter your mobile number.',
            'warning',
            'Login'
          );


          return {
            success: false,
          };

        }


        setIsLoadingCitizen(true);


        try {

          setBackendStatus('checking');


          const response =
            await api.getCitizenByMobile(
              cleanMobile
            );


          console.log(
            'CITIZEN MOBILE LOOKUP:',
            response
          );


          if (
            !response ||
            !response.found ||
            !response.citizen
          ) {

            setIsBackendConnected(true);

            setBackendStatus('connected');


            showToast(
              'No citizen record was found for this mobile number.',
              'error',
              'Citizen Not Found'
            );


            return {
              success: false,
            };

          }


          const citizen =
            response.citizen;


          const actualCitizenId =
            citizen.citizen_id;


          clearCitizenData();


          setUser({

            name:
              citizen.name ||
              `Citizen (${actualCitizenId})`,

            citizenId:
              actualCitizenId,

            email:
              '',

            mobile:
              citizen.phone ||
              cleanMobile,

            phone:
              citizen.phone ||
              cleanMobile,

            dob:
              citizen.dob ||
              '',

            gender:
              citizen.gender ||
              '',

            aadhaarNumber:
              'XXXX-XXXX-XXXX',

            address:
              citizen.address ||
              '',

            initials:
              (
                citizen.name ||
                'C'
              )
                .split(' ')
                .map(
                  (word) =>
                    word[0]
                )
                .join('')
                .slice(0, 2)
                .toUpperCase(),

          });


          setCitizenId(
            actualCitizenId
          );


          setCurrentPortal(
            'citizen'
          );


          setActiveTab(
            'dashboard'
          );


          await refreshBackendData(
            actualCitizenId
          );


          showToast(
            `Welcome, ${citizen.name || 'Citizen'}!`,
            'success',
            'Login Successful'
          );


          return {

            success: true,

            citizen,

          };

        } catch (error) {

          console.error(
            'Citizen login failed:',
            error
          );


          showToast(
            error.message ||
              'Unable to connect to the backend.',
            'error',
            'Login Failed'
          );


          return {

            success: false,

            error,

          };

        } finally {

          setIsLoadingCitizen(false);

        }

      },
      [
        clearCitizenData,
        refreshBackendData,
        showToast,
      ]
    );


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout =
    useCallback(
      () => {

        clearCitizenData();

        setCitizenId(null);

        setCurrentPortal('citizen');

        setActiveTab('dashboard');

        setBackendStatus('checking');

        setIsBackendConnected(false);

      },
      [
        clearCitizenData,
      ]
    );


  // ============================================================
  // SWITCH CITIZEN
  // ============================================================

  const handleSwitchCitizen =
    useCallback(
      async (newCitizenId) => {

        const cleanId =
          String(
            newCitizenId || ''
          ).trim();


        if (!cleanId) {
          return;
        }


        clearCitizenData();


        setCitizenId(
          cleanId
        );


        setCurrentPortal(
          'citizen'
        );


        setActiveTab(
          'dashboard'
        );


        await refreshBackendData(
          cleanId
        );


        showToast(
          `Switched to citizen ${cleanId}`,
          'success'
        );

      },
      [
        clearCitizenData,
        refreshBackendData,
        showToast,
      ]
    );


  // ============================================================
  // PERIODIC BACKEND SYNC
  // ============================================================

  useEffect(() => {

    if (!citizenId) {
      return;
    }


    const interval =
      setInterval(
        () => {

          refreshBackendData(
            citizenId
          );

        },
        15000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    citizenId,
    refreshBackendData,
  ]);


  // ============================================================
  // CREATE / SUBMIT APPLICATION
  // ============================================================

  const createApplication =
    useCallback(
      async (formData) => {

        const schemeName =
          formData?.serviceName ||
          'Education Scholarship';


        if (!citizenId) {

          const result = {

            application_submitted:
              false,

            message:
              'Please login first.',

            reasons: [],

          };


          showToast(
            result.message,
            'warning',
            'Application'
          );


          return result;

        }


        console.log(
          'APPLICATION SUBMISSION STARTED'
        );


        console.log(
          'Citizen ID:',
          citizenId
        );


        console.log(
          'Scheme:',
          schemeName
        );


        console.log(
          'Application Form:',
          formData
        );


        try {

          const response =
            await api.submitApplication(
              citizenId,
              schemeName,
              formData || {}
            );


          console.log(
            'APPLICATION SUBMISSION RESULT:',
            response
          );


          // ====================================================
          // SUCCESS
          // ====================================================

          if (
            response?.application_submitted ===
            true
          ) {

            setPendingApplication(null);

            setPendingApplicationMissingConsents([]);


            showToast(
              `Application ${
                response.application?.application_id ||
                'submitted'
              } created successfully!`,
              'success',
              'Application Submitted'
            );


            triggerConfetti();


            await refreshBackendData(
              citizenId
            );


            setActiveTab(
              'tracking'
            );


            return response;

          }


          // ====================================================
          // CONSENT MISSING
          // ====================================================

          const missingConsents =
            Array.isArray(
              response?.missing_consents
            )
              ? response.missing_consents
              : Array.isArray(
                  response?.missing_departments
                )
              ? response.missing_departments
              : [];


          const consentRequired =
            response?.application_submitted ===
              false &&
            (
              missingConsents.length > 0 ||
              String(
                response?.message || ''
              )
                .toLowerCase()
                .includes(
                  'consent'
                )
            );


          if (consentRequired) {

            console.log(
              'APPLICATION BLOCKED: CONSENT REQUIRED'
            );


            console.log(
              'MISSING CONSENTS:',
              missingConsents
            );


            setPendingApplication({

              ...formData,

              serviceName:
                schemeName,

            });


            setPendingApplicationMissingConsents(
              missingConsents
            );


            showToast(
              response?.message ||
                'Required consent is needed before this application can be submitted.',
              'warning',
              'Consent Required'
            );


            return {

              ...response,

              missing_consents:
                missingConsents,

            };

          }


          // ====================================================
          // ELIGIBILITY FAILURE
          // ====================================================

          if (
            response?.application_submitted ===
              false
          ) {

            const reasons =
              Array.isArray(
                response?.reasons
              )
                ? response.reasons
                : Array.isArray(
                    response?.eligibility?.reasons
                  )
                ? response.eligibility.reasons
                : [];


            console.log(
              'ELIGIBILITY FAILURE REASONS:',
              reasons
            );


            showToast(
              response?.message ||
                response?.eligibility?.message ||
                'Citizen is not eligible for this scheme.',
              'warning',
              'Eligibility Check'
            );


            return response;

          }


          return response;


        } catch (error) {

          console.error(
            'Backend application submit error:',
            error
          );


          const errorResponse = {

            application_submitted:
              false,

            message:
              error?.message ||
              'Application submission failed.',

            reasons: [],

          };


          showToast(
            errorResponse.message,
            'error',
            'Submission Error'
          );


          return errorResponse;

        }

      },
      [
        citizenId,
        refreshBackendData,
        showToast,
        triggerConfetti,
      ]
    );


  // ============================================================
  // UPDATE APPLICATION STATUS
  // ============================================================

  const updateApplicationStatus =
    useCallback(
      async (
        applicationId,
        newStatus
      ) => {

        if (!applicationId) {
          return null;
        }


        if (!newStatus) {
          return null;
        }


        try {

          const response =
            await api.updateApplicationStatus(
              applicationId,
              officerId,
              newStatus
            );


          if (citizenId) {

            await refreshBackendData(
              citizenId
            );

          }


          return response;


        } catch (error) {

          showToast(
            error.message ||
              'Unable to update application.',
            'error',
            'Update Failed'
          );


          throw error;

        }

      },
      [
        citizenId,
        officerId,
        refreshBackendData,
        showToast,
      ]
    );


  // ============================================================
  // OFFICER APPROVE APPLICATION
  // ============================================================

  const handleOfficerApproveApp =
    useCallback(
      async (applicationId) => {

        try {

          const response =
            await updateApplicationStatus(
              applicationId,
              'APPROVED'
            );


          showToast(
            'Application approved successfully.',
            'success',
            'Application Approved'
          );


          triggerConfetti();


          return response;

        } catch (error) {

          console.error(
            'Officer approval failed:',
            error
          );


          throw error;

        }

      },
      [
        updateApplicationStatus,
        showToast,
        triggerConfetti,
      ]
    );


  // ============================================================
  // OFFICER REJECT APPLICATION
  // ============================================================

  const handleOfficerRejectApp =
    useCallback(
      async (applicationId) => {

        try {

          const response =
            await updateApplicationStatus(
              applicationId,
              'REJECTED'
            );


          showToast(
            'Application rejected successfully.',
            'warning',
            'Application Rejected'
          );


          return response;

        } catch (error) {

          console.error(
            'Officer rejection failed:',
            error
          );


          throw error;

        }

      },
      [
        updateApplicationStatus,
        showToast,
      ]
    );


  // ============================================================
  // GRANT CONSENT
  // ============================================================

  const grantConsent =
    useCallback(
      async (
        dataProvider,
        dataType,
        purpose
      ) => {

        if (!citizenId) {

          showToast(
            'Please login first.',
            'warning',
            'Consent'
          );


          return null;

        }


        try {

          console.log(
            'GRANTING CONSENT:',
            {
              citizenId,
              dataProvider,
              dataType,
              purpose,
            }
          );


          const response =
            await api.grantConsent(
              citizenId,
              dataProvider,
              dataType,
              purpose
            );


          console.log(
            'CONSENT GRANT RESPONSE:',
            response
          );


          // ====================================================
          // REFRESH LIVE DATA
          // ====================================================

          await refreshBackendData(
            citizenId
          );


          // ====================================================
          // RESUME PENDING APPLICATION
          // ====================================================

          if (pendingApplication) {

            console.log(
              'PENDING APPLICATION FOUND — RETRYING SUBMISSION'
            );


            console.log(
              'Pending application:',
              pendingApplication
            );


            try {

              const resumedResponse =
                await api.submitApplication(
                  citizenId,
                  pendingApplication.serviceName ||
                    'Education Scholarship',
                  pendingApplication
                );


              console.log(
                'RESUMED APPLICATION RESULT:',
                resumedResponse
              );


              // ------------------------------------------------
              // RESUMED SUCCESS
              // ------------------------------------------------

              if (
                resumedResponse?.application_submitted ===
                true
              ) {

                setPendingApplication(null);

                setPendingApplicationMissingConsents([]);


                showToast(
                  `Application ${
                    resumedResponse.application?.application_id ||
                    'submitted'
                  } submitted successfully after consent.`,
                  'success',
                  'Application Submitted'
                );


                triggerConfetti();


                await refreshBackendData(
                  citizenId
                );


                setActiveTab(
                  'tracking'
                );


                return resumedResponse;

              }


              // ------------------------------------------------
              // MORE CONSENTS REQUIRED
              // ------------------------------------------------

              const remainingConsents =
                Array.isArray(
                  resumedResponse?.missing_consents
                )
                  ? resumedResponse.missing_consents
                  : Array.isArray(
                      resumedResponse?.missing_departments
                    )
                  ? resumedResponse.missing_departments
                  : [];


              if (
                remainingConsents.length > 0
              ) {

                setPendingApplicationMissingConsents(
                  remainingConsents
                );


                showToast(
                  'Additional consent is still required.',
                  'warning',
                  'Consent Required'
                );


                return resumedResponse;

              }


              // ------------------------------------------------
              // ELIGIBILITY FAILURE
              // ------------------------------------------------

              if (
                resumedResponse?.application_submitted ===
                false
              ) {

                showToast(
                  resumedResponse?.message ||
                    resumedResponse?.eligibility?.message ||
                    'Application could not be submitted.',
                  'warning',
                  'Application'
                );

              }


              return resumedResponse;


            } catch (resumeError) {

              console.error(
                'Pending application resume failed:',
                resumeError
              );


              showToast(
                resumeError?.message ||
                  'Unable to resume the pending application.',
                'error',
                'Application Resume Failed'
              );


              throw resumeError;

            }

          }


          // ====================================================
          // NORMAL CONSENT SUCCESS
          // ====================================================

          showToast(
            'Consent granted successfully.',
            'success',
            'Consent Updated'
          );


          return response;


        } catch (error) {

          console.error(
            'Consent grant error:',
            error
          );


          showToast(
            error.message ||
              'Unable to grant consent.',
            'error',
            'Consent Failed'
          );


          throw error;

        }

      },
      [
        citizenId,
        pendingApplication,
        refreshBackendData,
        showToast,
        triggerConfetti,
      ]
    );


  // ============================================================
  // TOGGLE CONSENT
  // ============================================================

  const handleToggleConsent =
    useCallback(
      async (
        id,
        nextState,
        target = null
      ) => {

        // ======================================================
        // TURN ON / GRANT
        // ======================================================

        if (nextState) {

          if (!citizenId) {

            showToast(
              'Please login first.',
              'warning',
              'Consent'
            );


            return;

          }


          try {

            const dataProvider =
              target?.department ||
              target?.dataProvider ||
              target?.data_provider ||
              'Education Department';


            const dataType =
              target?.category ||
              target?.dataType ||
              target?.data_type ||
              'Education';


            const purpose =
              target?.purpose ||
              'Education Scholarship';


            await grantConsent(
              dataProvider,
              dataType,
              purpose
            );


            // ==================================================
            // UPDATE LOCAL UI
            // ==================================================

            setConsents(
              (previous) => {

                const exists =
                  previous.some(
                    (item) =>
                      item.id === id ||
                      item.consent_id === id
                  );


                if (!exists) {

                  return [

                    ...previous,

                    {

                      id,

                      consent_id:
                        id,

                      name:
                        target?.name ||
                        dataProvider,

                      department:
                        dataProvider,

                      category:
                        dataType,

                      dataProvider,

                      dataType,

                      purpose,

                      enabled:
                        true,

                      status:
                        'GRANTED',

                    },

                  ];

                }


                return previous.map(
                  (item) => {

                    if (
                      item.id === id ||
                      item.consent_id === id
                    ) {

                      return {

                        ...item,

                        enabled:
                          true,

                        status:
                          'GRANTED',

                      };

                    }


                    return item;

                  }
                );

              }
            );


            // NOTE:
            // grantConsent already shows a success toast.
            // We do not show another duplicate toast here.


          } catch (error) {

            console.warn(
              'Consent sync to backend error:',
              error
            );


            // grantConsent already displays
            // the backend error toast.

          }


          return;

        }


        // ======================================================
        // TURN OFF
        // ======================================================

        setConsents(
          (previous) =>
            previous.map(
              (item) => {

                if (
                  item.id === id ||
                  item.consent_id === id
                ) {

                  showToast(
                    `${item.name || 'Consent'} is now paused locally.`,
                    'info',
                    'Consent Updated'
                  );


                  return {

                    ...item,

                    enabled:
                      false,

                  };

                }


                return item;

              }
            )
        );

      },
      [
        citizenId,
        grantConsent,
        showToast,
      ]
    );


  // ============================================================
  // PROVIDER VALUE
  // ============================================================

  const value = {

    // ----------------------------------------------------------
    // Portal
    // ----------------------------------------------------------

    currentPortal,

    setCurrentPortal,


    // ----------------------------------------------------------
    // Citizen
    // ----------------------------------------------------------

    citizenId,

    setCitizenId,

    handleCitizenLogin,

    handleSwitchCitizen,

    handleLogout,


    // ----------------------------------------------------------
    // Officer
    // ----------------------------------------------------------

    officerId,

    setOfficerId,

    handleOfficerApproveApp,

    handleOfficerRejectApp,


    // ----------------------------------------------------------
    // Navigation
    // ----------------------------------------------------------

    activeTab,

    setActiveTab,

    searchQuery,

    setSearchQuery,

    selectedCategory,

    setSelectedCategory,


    // ----------------------------------------------------------
    // Sidebar
    // ----------------------------------------------------------

    isSidebarOpen,

    setIsSidebarOpen,

    isSidebarPinned,

    setIsSidebarPinned,


    // ----------------------------------------------------------
    // Backend
    // ----------------------------------------------------------

    isBackendConnected,

    backendStatus,

    isLoadingCitizen,

    refreshBackendData,


    // ----------------------------------------------------------
    // Live Data
    // ----------------------------------------------------------

    unifiedData,

    citizenDashboardData,

    reconciliationData,

    eligibilityData,

    pendingApplication,

    pendingApplicationMissingConsents,

    auditLogs,

    adminDashboardData,

    healthData,


    // ----------------------------------------------------------
    // User
    // ----------------------------------------------------------

    user,

    setUser,


    // ----------------------------------------------------------
    // Static Data
    // ----------------------------------------------------------

    services,

    categories,


    // ----------------------------------------------------------
    // Applications
    // ----------------------------------------------------------

    applications,

    setApplications,

    createApplication,

    updateApplicationStatus,

    selectedApplicationDetails,

    setSelectedApplicationDetails,


    // ----------------------------------------------------------
    // Notifications
    // ----------------------------------------------------------

    notifications,

    setNotifications,


    // ----------------------------------------------------------
    // Consents
    // ----------------------------------------------------------

    consents,

    setConsents,

    consentHistory,

    setConsentHistory,

    grantConsent,

    handleToggleConsent,


    // ----------------------------------------------------------
    // Modals
    // ----------------------------------------------------------

    selectedServiceModal,

    setSelectedServiceModal,

    isAadhaarModalOpen,

    setIsAadhaarModalOpen,


    // ----------------------------------------------------------
    // UI
    // ----------------------------------------------------------

    toast,

    showToast,


    // ----------------------------------------------------------
    // Effects
    // ----------------------------------------------------------

    triggerConfetti,

  };


  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );

};


// ============================================================
// USE APP
// ============================================================

export const useApp = () => {

  const context =
    useContext(
      AppContext
    );


  if (!context) {

    throw new Error(
      'useApp must be used inside AppProvider'
    );

  }


  return context;

};


export default AppContext;