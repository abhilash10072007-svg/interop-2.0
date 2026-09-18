// frontend/src/services/api.js

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const API_BASE = RAW_API_BASE.replace(/\/+$/, '');


// ============================================================
// GENERIC API REQUEST
// ============================================================

async function request(endpoint, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    let fullUrl;

    // Full URL
    if (
      endpoint.startsWith('http://') ||
      endpoint.startsWith('https://')
    ) {
      fullUrl = endpoint;
    } else {
      const cleanEndpoint = endpoint.startsWith('/')
        ? endpoint
        : '/' + endpoint;

      const apiPath = cleanEndpoint.startsWith('/api')
        ? cleanEndpoint
        : '/api' + cleanEndpoint;

      fullUrl = API_BASE + apiPath;
    }

    console.log('API Request:', fullUrl);

    const response = await fetch(fullUrl, {
      ...options,

      signal: controller.signal,

      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = '';

      try {
        const errorJson = await response.json();

        errorDetail =
          errorJson.message ||
          errorJson.detail ||
          JSON.stringify(errorJson);
      } catch {
        errorDetail = await response
          .text()
          .catch(() => '');
      }

      throw new Error(
        `[${response.status}] ${
          errorDetail || response.statusText
        }`
      );
    }

    return await response.json();

  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      console.error(
        `API Request Timeout: ${endpoint}`
      );

      throw new Error(
        `Request timed out: ${endpoint}`
      );
    }

    console.error(
      `API Request Failed: ${endpoint}`,
      err
    );

    throw err;
  }
}


// ============================================================
// API
// ============================================================

const api = {

  // ==========================================================
  // BACKEND HEALTH
  // ==========================================================

  async checkBackendHealth() {
    try {
      const res = await request(
        '/health/departments',
        {
          method: 'GET',
        },
        2500
      );

      return {
        online: true,
        data: res,
      };

    } catch {
      try {
        const root = await request(
          '/',
          {
            method: 'GET',
          },
          2000
        );

        return {
          online: true,
          data: root,
        };

      } catch (err) {

        return {
          online: false,
          error: err.message,
        };
      }
    }
  },


  // ==========================================================
  // CITIZEN
  // ==========================================================

  async getCitizenByMobile(mobile) {
    return await request(
      '/citizens/by-mobile/' +
        encodeURIComponent(mobile)
    );
  },


  async getCitizenUnified(citizenId) {
    return await request(
      '/citizens/' +
        encodeURIComponent(citizenId) +
        '/unified'
    );
  },


  async getCitizenDashboard(citizenId) {
    return await request(
      '/citizens/' +
        encodeURIComponent(citizenId) +
        '/dashboard'
    );
  },


  async getCitizenScholarshipData(citizenId) {
    return await request(
      '/citizens/' +
        encodeURIComponent(citizenId) +
        '/scholarship-data'
    );
  },


  async checkEligibility(
    citizenId,
    schemeName
  ) {
    const params = new URLSearchParams({
      scheme_name: schemeName,
    });

    return await request(
      '/citizens/' +
        encodeURIComponent(citizenId) +
        '/eligibility?' +
        params.toString()
    );
  },


  // ==========================================================
  // RECONCILIATION
  // ==========================================================

  async getReconciliation(citizenId) {
    return await request(
      '/reconciliation/' +
        encodeURIComponent(citizenId)
    );
  },


  // ==========================================================
  // APPLICATIONS
  // ==========================================================

  async submitApplication(
    citizenId,
    schemeName
  ) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      scheme_name: schemeName,
    });

    return await request(
      '/applications/submit?' +
        params.toString(),
      {
        method: 'POST',
      }
    );
  },


  async getApplication(applicationId) {
    return await request(
      '/applications/' +
        encodeURIComponent(applicationId)
    );
  },


  async getCitizenApplications(citizenId) {
    return await request(
      '/applications/citizen/' +
        encodeURIComponent(citizenId)
    );
  },


  async updateApplicationStatus(
    applicationId,
    userId,
    newStatus
  ) {
    const params = new URLSearchParams({
      user_id: userId,
      new_status: newStatus,
    });

    return await request(
      '/applications/' +
        encodeURIComponent(applicationId) +
        '/status?' +
        params.toString(),
      {
        method: 'PUT',
      }
    );
  },


  // ==========================================================
  // CONSENT
  // ==========================================================

  async grantConsent(
    citizenId,
    dataProvider,
    dataType,
    purpose
  ) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      data_provider: dataProvider,
      data_type: dataType,
      purpose: purpose,
    });

    return await request(
      '/consent/grant?' +
        params.toString(),
      {
        method: 'POST',
      }
    );
  },


  async checkConsent(
    citizenId,
    dataProvider,
    dataType,
    purpose
  ) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      data_provider: dataProvider,
      data_type: dataType,
      purpose: purpose,
    });

    return await request(
      '/consent/check?' +
        params.toString()
    );
  },


  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  async getNotifications(citizenId) {
    return await request(
      '/notifications/' +
        encodeURIComponent(citizenId)
    );
  },


  async createNotification(
    citizenId,
    eventType,
    message
  ) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      event_type: eventType,
      message: message,
    });

    return await request(
      '/notifications/create?' +
        params.toString(),
      {
        method: 'POST',
      }
    );
  },


  // ----------------------------------------------------------
  // MARK ONE NOTIFICATION AS READ
  // ----------------------------------------------------------

  async markNotificationRead(
    notificationId
  ) {
    return await request(
      '/notifications/' +
        encodeURIComponent(notificationId) +
        '/read',
      {
        method: 'PUT',
      }
    );
  },


  // ----------------------------------------------------------
  // MARK ALL NOTIFICATIONS AS READ
  // ----------------------------------------------------------

  async markAllNotificationsRead(
    citizenId
  ) {
    return await request(
      '/notifications/' +
        encodeURIComponent(citizenId) +
        '/read-all',
      {
        method: 'PUT',
      }
    );
  },


  // ==========================================================
  // AUDIT
  // ==========================================================

  async getAuditLogs(citizenId) {
    return await request(
      '/audit/' +
        encodeURIComponent(citizenId)
    );
  },


  // ==========================================================
  // USERS
  // ==========================================================

  async getUser(userId) {
    return await request(
      '/users/' +
        encodeURIComponent(userId)
    );
  },


  async checkUserRole(
    userId,
    requiredRole
  ) {
    const params = new URLSearchParams({
      required_role: requiredRole,
    });

    return await request(
      '/users/' +
        encodeURIComponent(userId) +
        '/check-role?' +
        params.toString()
    );
  },


  // ==========================================================
  // ADMIN
  // ==========================================================

  async getAdminDashboard() {
    return await request(
      '/admin/dashboard'
    );
  },


  // ==========================================================
  // HEALTH DEPARTMENTS
  // ==========================================================

  async getHealthDepartments() {
    return await request(
      '/health/departments'
    );
  },
};


// ============================================================
// EXPORT
// ============================================================

export default api;