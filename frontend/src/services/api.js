/**
 * InterOp API Service Layer
 * Interfaces directly with FastAPI backend (:8000) with automatic proxy routing,
 * health detection, and error recovery.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = endpoint.startsWith('http') ? endpoint : (API_BASE + endpoint);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error('API Error [' + response.status + ']: ' + (errorText || response.statusText));
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  /**
   * Check if the FastAPI backend server is alive and responding
   */
  async checkBackendHealth() {
    try {
      const res = await request('/health', { method: 'GET' }, 2000);
      return { online: true, data: res };
    } catch {
      try {
        const root = await request('/', { method: 'GET' }, 1500);
        return { online: true, data: root };
      } catch {
        return { online: false, data: null };
      }
    }
  },

  /**
   * Fetch complete unified citizen dashboard data
   * Returns: { citizen, applications, notifications, consents, audit_logs }
   */
  async getCitizenDashboard(citizenId) {
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/dashboard');
  },

  /**
   * Fetch unified citizen data
   */
  async getCitizenUnified(citizenId) {
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/unified');
  },

  /**
   * Check citizen eligibility for a specific scheme
   */
  async checkEligibility(citizenId, schemeName) {
    const params = new URLSearchParams({ citizen_id: citizenId, scheme_name: schemeName });
    return await request('/citizens/' + encodeURIComponent(citizenId) + '/eligibility?' + params.toString());
  },

  /**
   * Submit an application for a scheme
   */
  async submitApplication(citizenId, schemeName) {
    const params = new URLSearchParams({ citizen_id: citizenId, scheme_name: schemeName });
    return await request('/applications/submit?' + params.toString(), {
      method: 'POST'
    });
  },

  /**
   * Track status of an application by ID
   */
  async getApplication(applicationId) {
    return await request('/applications/' + encodeURIComponent(applicationId));
  },

  /**
   * Get all applications for a citizen
   */
  async getCitizenApplications(citizenId) {
    return await request('/applications/citizen/' + encodeURIComponent(citizenId));
  },

  /**
   * Grant consent for a data provider and purpose
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

  /**
   * Check consent status
   */
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
   * Fetch notifications for a citizen
   */
  async getNotifications(citizenId) {
    return await request('/notifications/' + encodeURIComponent(citizenId));
  },

  /**
   * Create a new notification
   */
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
};

export default api;
