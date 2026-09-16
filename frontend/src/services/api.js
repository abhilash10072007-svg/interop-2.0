/**
 * GovSync / InterOp API Service Layer
 * Interfaces directly with FastAPI backend on port 8001 under /api prefix.
 * Fully decoupled from authentication (prototype mode).
 */

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '';
// Ensure no trailing slash
export const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

/**
 * Universal request wrapper with timeout and rich error reporting
 */
async function request(endpoint, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let fullUrl;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      fullUrl = endpoint;
    } else {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
      const apiPath = cleanEndpoint.startsWith('/api') ? cleanEndpoint : '/api' + cleanEndpoint;
      fullUrl = API_BASE + apiPath;
    }

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
        const errJson = await response.json();
        errorDetail = errJson.message || errJson.detail || JSON.stringify(errJson);
      } catch {
        errorDetail = await response.text().catch(() => '');
      }
      throw new Error(`[${response.status}] ${errorDetail || response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`API Request Failed: ${endpoint}`, err);
    throw err;
  }
}

export const api = {
  /**
   * Health Check: Probe FastAPI health status
   */
  async checkBackendHealth() {
    try {
      const res = await request('/health/departments', { method: 'GET' }, 2500);
      return { online: true, data: res };
    } catch {
      try {
        const root = await request('/', { method: 'GET' }, 2000);
        return { online: true, data: root };
      } catch (err) {
        return { online: false, error: err.message };
      }
    }
  },

  /**
   * CITIZEN ENDPOINTS
   */
  async getCitizenUnified(citizenId) {
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/unified');
  },

  async getCitizenDashboard(citizenId) {
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/dashboard');
  },

  async getCitizenScholarshipData(citizenId) {
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/scholarship-data');
  },

  async checkEligibility(citizenId, schemeName) {
    const params = new URLSearchParams({ scheme_name: schemeName });
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/eligibility?' + params.toString());
  },

  /**
   * RECONCILIATION
   */
  async getReconciliation(citizenId) {
    return await request('/reconciliation/' + encodeURIComponent(citizenId));
  },

  /**
   * APPLICATIONS
   */
  async submitApplication(citizenId, schemeName) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      scheme_name: schemeName,
    });
    return await request('/applications/submit?' + params.toString(), {
      method: 'POST'
    });
  },

  async getApplication(applicationId) {
    return await request('/applications/' + encodeURIComponent(applicationId));
  },

  async getCitizenApplications(citizenId) {
    return await request('/applications/citizen/' + encodeURIComponent(citizenId));
  },

  async updateApplicationStatus(applicationId, userId, newStatus) {
    const params = new URLSearchParams({
      user_id: userId,
      new_status: newStatus,
    });
    return await request('/applications/' + encodeURIComponent(applicationId) + '/status?' + params.toString(), {
      method: 'PUT'
    });
  },

  /**
   * CONSENT
   */
  async grantConsent(citizenId, dataProvider, dataType, purpose) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      data_provider: dataProvider,
      data_type: dataType,
      purpose: purpose,
    });
    return await request('/consent/grant?' + params.toString(), {
      method: 'POST'
    });
  },

  async checkConsent(citizenId, dataProvider, dataType, purpose) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      data_provider: dataProvider,
      data_type: dataType,
      purpose: purpose,
    });
    return await request('/consent/check?' + params.toString());
  },

  /**
   * NOTIFICATIONS
   */
  async getNotifications(citizenId) {
    return await request('/notifications/' + encodeURIComponent(citizenId));
  },

  async createNotification(citizenId, eventType, message) {
    const params = new URLSearchParams({
      citizen_id: citizenId,
      event_type: eventType,
      message: message,
    });
    return await request('/notifications/create?' + params.toString(), {
      method: 'POST'
    });
  },

  /**
   * AUDIT LOGS
   */
  async getAuditLogs(citizenId) {
    return await request('/audit/' + encodeURIComponent(citizenId));
  },

  /**
   * USERS / ROLES
   */
  async getUser(userId) {
    return await request('/users/' + encodeURIComponent(userId));
  },

  async checkUserRole(userId, requiredRole) {
    const params = new URLSearchParams({ required_role: requiredRole });
    return await request('/users/' + encodeURIComponent(userId) + '/check-role?' + params.toString());
  },

  /**
   * ADMIN DASHBOARD & DEPARTMENT HEALTH
   */
  async getAdminDashboard() {
    return await request('/admin/dashboard');
  },

  async getHealthDepartments() {
    return await request('/health/departments');
  }
};

export default api;
