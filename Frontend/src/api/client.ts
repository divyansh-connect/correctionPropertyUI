const BASE_URL = 'https://doorloop-backend-production.up.railway.app/api/v1';

export const apiClient = {
  getHeaders: () => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: apiClient.getHeaders(),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: apiClient.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: apiClient.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: apiClient.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: apiClient.getHeaders(),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },
};
export default apiClient;
