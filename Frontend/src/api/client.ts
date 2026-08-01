import { useAuthStore } from '../store/useStore';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Dynamically resolve local host name to support other devices on the same Wi-Fi
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:5000/api/v1`;
};

const BASE_URL = getBaseUrl();

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
    const userStr = sessionStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  getAuthHeaders: (): Record<string, string> => {
    const userStr = sessionStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  handleResponseError: async (response: Response) => {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'API request failed');
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
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers: any = isFormData ? apiClient.getAuthHeaders() : apiClient.getHeaders();
    
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'POST',
          headers,
          body: isFormData ? data : JSON.stringify(data),
        });
      }
    }

    if (!response.ok) {
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers: any = isFormData ? apiClient.getAuthHeaders() : apiClient.getHeaders();

    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'PUT',
          headers,
          body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        });
      }
    }

    if (!response.ok) {
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },

  patch: async <T>(url: string, data?: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const headers: any = isFormData ? apiClient.getAuthHeaders() : apiClient.getHeaders();

    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers,
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized();
      if (refreshed) {
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'PATCH',
          headers,
          body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        });
      }
    }

    if (!response.ok) {
      await apiClient.handleResponseError(response);
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
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },
};
export default apiClient;
