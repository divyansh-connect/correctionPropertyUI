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
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
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

    localStorage.setItem('user', JSON.stringify(loggedInUser));
    set({ user: loggedInUser, isAuthenticated: true });
    return true;
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  refreshAccessToken: async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;
      const userData = JSON.parse(userStr);
      if (!userData.refreshToken) return false;

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: userData.refreshToken }),
      });

      if (!response.ok) return false;

      const resData = await response.json();
      const newToken = resData.data.accessToken;

      const updatedUser = { ...userData, token: newToken };
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read' | 'role'> & { role?: string; targetId?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (role?: string) => void;
  clearAll: (role?: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    // Property Manager
    { id: 'notif-1', title: 'New Maintenance Request', message: 'AC Not Cooling in Unit 301 (Sunset Villas)', time: '10m ago', read: false, type: 'warning', role: 'Property Manager', targetId: 'sr-1' },
    { id: 'notif-2', title: 'Payment Received', message: 'John Doe paid $1,850 rent for Unit 101', time: '1h ago', read: false, type: 'success', role: 'Property Manager', targetId: 'pay-8001' },
    { id: 'notif-3', title: 'Lease Expiring Soon', message: 'Jane Smith (Unit 102) lease expires in 12 days', time: '1d ago', read: true, type: 'info', role: 'Property Manager', targetId: 'lease-1' },

    // Super Admin
    { id: 'notif-13', title: 'New Company Registered', message: 'Acme Corp registered on the platform', time: '10m ago', read: false, type: 'success', role: 'Super Admin' },
    { id: 'notif-14', title: 'Subscription Renewed', message: 'Elite Properties renewed their Enterprise Plan', time: '1h ago', read: false, type: 'success', role: 'Super Admin' },
    { id: 'notif-15', title: 'System Maintenance Scheduled', message: 'Database backup and optimization completed', time: '5h ago', read: true, type: 'info', role: 'Super Admin' },

    // Tenant
    { id: 'notif-4', title: 'Rent Payment Due', message: 'Your rent of $1,850 for Unit 301 is due in 3 days', time: '2h ago', read: false, type: 'warning', role: 'Tenant', targetId: 'tenant-pay-1' },
    { id: 'notif-5', title: 'Maintenance Update', message: 'AC Maintenance scheduled for tomorrow at 10:00 AM', time: '5h ago', read: false, type: 'info', role: 'Tenant', targetId: 'tenant-sr-1' },
    { id: 'notif-6', title: 'Receipt Confirmed', message: 'Payment of $1,850 for June Rent has been processed', time: '2d ago', read: true, type: 'success', role: 'Tenant', targetId: 'tenant-pay-2' },

    // Owner
    { id: 'notif-7', title: 'Monthly Distribution Ready', message: 'Owner payout of $4,500 has been sent to your account', time: '3h ago', read: false, type: 'success', role: 'Owner' },
    { id: 'notif-8', title: 'Lease Renewal Signed', message: 'Tenant Jane Smith in Unit 102 renewed their lease for 12 months', time: '1d ago', read: false, type: 'info', role: 'Owner' },
    { id: 'notif-9', title: 'Approval Required', message: 'Urgent: Roof leak repair estimate of $850 requires your approval', time: '3d ago', read: true, type: 'warning', role: 'Owner' },

    // Maintenance Staff
    { id: 'notif-10', title: 'New Job Assigned', message: 'AC Not Cooling - Unit 301 (Sunset Villas)', time: '15m ago', read: false, type: 'warning', role: 'Maintenance Staff', targetId: 'wo-4001' },
    { id: 'notif-11', title: 'Urgent Task', message: 'Water leakage in kitchen - Unit 102', time: '2h ago', read: false, type: 'warning', role: 'Maintenance Staff', targetId: 'wo-4002' },
    { id: 'notif-12', title: 'Task Rescheduled', message: 'Electrical Inspection - Unit 204 moved to July 25th', time: '1d ago', read: true, type: 'info', role: 'Maintenance Staff', targetId: 'wo-4003' },
  ],
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
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: (role) => set((state) => ({
    notifications: state.notifications.map((n) => {
      if (!role) return { ...n, read: true };
      const matchesRole = n.role === role;
      return matchesRole ? { ...n, read: true } : n;
    })
  })),
  clearAll: (role) => set((state) => ({
    notifications: role 
      ? state.notifications.filter((n) => !(n.role === role))
      : []
  })),
}));
