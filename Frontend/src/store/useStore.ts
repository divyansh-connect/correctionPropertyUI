import { create } from 'zustand';
import { apiClient } from '../api/client';

// --- Theme Store ---
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark';
  let initialTheme: 'light' | 'dark' = 'light';
  if (saved) {
    initialTheme = saved;
  } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initialTheme = 'dark';
  }
  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    }),
    setTheme: (theme) => set(() => {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme };
    }),
  };
});

// Initialize theme on load
if (
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}


// --- Auth Store ---
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  token?: string;
  refreshToken?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  isAuthenticated: !!sessionStorage.getItem('user'),
  login: async (email: string, password?: string) => {
    const resData = await apiClient.post<any>('/auth/login', { email, password: password || 'admin123' });


    const apiUser = resData.data.user;
    const token = resData.data.accessToken;
    const refreshToken = resData.data.refreshToken;

    const loggedInUser: User = {
      id: apiUser.id,
      name: `${apiUser.firstName} ${apiUser.lastName}`,
      email: apiUser.email,
      role: apiUser.roleName,
      token: token,
      refreshToken: refreshToken,
    };

    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    set({ user: loggedInUser, isAuthenticated: true });
    return true;
  },
  logout: () => {
    sessionStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  refreshAccessToken: async () => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) return false;
      const userData = JSON.parse(userStr);
      if (!userData.refreshToken) return false;

      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const baseUrl = import.meta.env.VITE_API_URL || `http://${host}:5000/api/v1`;
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: userData.refreshToken }),
      });

      if (!response.ok) return false;

      const resData = await response.json();
      const newToken = resData.data.accessToken;

      const updatedUser = { ...userData, token: newToken };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return true;
    } catch {
      return false;
    }
  },
}));


// --- Notifications Store ---
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
  role: string;
  targetId?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read' | 'role'> & { role?: string; targetId?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (role?: string) => void;
  clearAll: (role?: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: `notif-${Date.now()}`,
        time: 'Just now',
        read: false,
        role: n.role || 'Property Manager',
        targetId: n.targetId,
      },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => {
    apiClient.put(`/notifications/${id}/read`).catch(() => {});
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    }));
  },
  markAllAsRead: (role) => {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    apiClient.put(`/notifications/read-all${query}`).catch(() => {});
    set((state) => ({
      notifications: state.notifications.map((n) => {
        if (!role) return { ...n, read: true };
        return n.role === role ? { ...n, read: true } : n;
      })
    }));
  },
  clearAll: (role) => {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    apiClient.delete(`/notifications${query}`).catch(() => {});
    set((state) => ({
      notifications: role 
        ? state.notifications.filter((n) => !(n.role === role))
        : []
    }));
  },
}));

// --- Error Modal Store ---
interface ErrorState {
  isOpen: boolean;
  title: string;
  message: string;
  showError: (title: string, message: string) => void;
  closeError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  showError: (title, message) => set({ isOpen: true, title, message }),
  closeError: () => set({ isOpen: false, title: '', message: '' }),
}));
