import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

// Safe storage wrapper to prevent native module crashes in Expo Go
let localCache = {};
const safeStorage = {
  getItem: async (key) => {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      console.log('AsyncStorage.getItem fallback:', e.message);
    }
    return localCache[key] || null;
  },
  setItem: async (key, value) => {
    localCache[key] = value;
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.log('AsyncStorage.setItem fallback:', e.message);
    }
  },
  removeItem: async (key) => {
    delete localCache[key];
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.log('AsyncStorage.removeItem fallback:', e.message);
    }
  }
};

const getBaseUrl = () => {
  // If EXPO_PUBLIC_API_URL env is set (e.g. live railway url), use it directly
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('Using Environment API URL:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }

  let ip = '';
  
  const debuggerHost = Constants.expoConfig?.hostUri || 
                       Constants.manifest?.debuggerHost || 
                       Constants.manifest2?.extra?.expoGo?.debuggerHost;
                       
  if (debuggerHost) {
    ip = debuggerHost.split(':')[0];
  }
  
  if (!ip || ip === 'localhost') {
    try {
      const url = Linking.createURL('/');
      const match = url.match(/\/\/([^:/]+)/);
      if (match && match[1]) {
        ip = match[1];
      }
    } catch (e) {
      // ignore
    }
  }

  if (!ip || ip === 'localhost') {
    ip = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  }
  
  console.log('Resolved Backend IP:', ip);
  return `http://${ip}:5000/api/v1`;
};

const BASE_URL = getBaseUrl();

let isRefreshing = false;
let refreshPromise = null;

async function handleUnauthorized(logoutFn, refreshFn) {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshFn();

  try {
    const success = await refreshPromise;
    if (!success) {
      logoutFn();
      return false;
    }
    return true;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

export const apiClient = {
  getHeaders: async () => {
    const userStr = await safeStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  getAuthHeaders: async () => {
    const userStr = await safeStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  handleResponseError: async (response) => {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'API request failed');
  },

  get: async (url, logoutFn, refreshFn) => {
    const headers = await apiClient.getHeaders();
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized(logoutFn, refreshFn);
      if (refreshed) {
        const newHeaders = await apiClient.getHeaders();
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'GET',
          headers: newHeaders,
        });
      }
    }

    if (!response.ok) {
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },

  post: async (url, data, logoutFn, refreshFn) => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? await apiClient.getAuthHeaders() : await apiClient.getHeaders();

    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized(logoutFn, refreshFn);
      if (refreshed) {
        const newHeaders = isFormData ? await apiClient.getAuthHeaders() : await apiClient.getHeaders();
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'POST',
          headers: newHeaders,
          body: isFormData ? data : JSON.stringify(data),
        });
      }
    }

    if (!response.ok) {
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },

  put: async (url, data, logoutFn, refreshFn) => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? await apiClient.getAuthHeaders() : await apiClient.getHeaders();

    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized(logoutFn, refreshFn);
      if (refreshed) {
        const newHeaders = isFormData ? await apiClient.getAuthHeaders() : await apiClient.getHeaders();
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'PUT',
          headers: newHeaders,
          body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        });
      }
    }

    if (!response.ok) {
      await apiClient.handleResponseError(response);
    }
    return response.json();
  },

  delete: async (url, logoutFn, refreshFn) => {
    const headers = await apiClient.getHeaders();
    let response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      const refreshed = await handleUnauthorized(logoutFn, refreshFn);
      if (refreshed) {
        const newHeaders = await apiClient.getHeaders();
        response = await fetch(`${BASE_URL}${url}`, {
          method: 'DELETE',
          headers: newHeaders,
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
