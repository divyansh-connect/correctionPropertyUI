const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = {
  getHeaders: () => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  handleResponse: async (response: Response) => {
    if (response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: apiClient.getHeaders(),
    });
    return apiClient.handleResponse(response);
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers: any = apiClient.getHeaders();
    if (isFormData) {
      delete headers['Content-Type'];
    }
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return apiClient.handleResponse(response);
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers: any = apiClient.getHeaders();
    if (isFormData) {
      delete headers['Content-Type'];
    }
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
    return apiClient.handleResponse(response);
  },

  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: apiClient.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return apiClient.handleResponse(response);
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: apiClient.getHeaders(),
    });
    return apiClient.handleResponse(response);
  },
};
export default apiClient;
