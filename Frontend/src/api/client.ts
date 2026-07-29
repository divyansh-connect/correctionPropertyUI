import { useAuthStore } from '../store/useStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Track if a token refresh is already in progress to avoid duplicate refreshes
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function handleUnauthorized(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = useAuthStore.getState().refreshAccessToken();

  try {
    const success = await refreshPromise;
    if (!success) {
      // Refresh failed — force logout and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return false;
    }
    return true;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

export const apiClient = {
  getHeaders: () => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  getAuthHeaders: (): Record<string, string> => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  postFormData: async <T>(url: string, formData: FormData): Promise<T> => {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: apiClient.getAuthHeaders(),
      body: formData,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'POST',
          headers: apiClient.getAuthHeaders(),
          body: formData,
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  get: async <T>(url: string): Promise<T> => {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: apiClient.getHeaders(),
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'GET',
          headers: apiClient.getHeaders(),
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: apiClient.getHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'POST',
          headers: apiClient.getHeaders(),
          body: JSON.stringify(data),
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: apiClient.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'PUT',
          headers: apiClient.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  patch: async <T>(url: string, data?: any): Promise<T> => {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: apiClient.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'PATCH',
          headers: apiClient.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },

  delete: async <T>(url: string): Promise<T> => {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: apiClient.getHeaders(),
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'DELETE',
          headers: apiClient.getHeaders(),
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return response.json();
  },
};
export default apiClient;
