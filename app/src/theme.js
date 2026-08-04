// Centralized Theme tokens for native mobile app feel

export const theme = {
  colors: {
    primary: '#38bdf8', // Vibrant Cyan/Sky blue
    primaryDark: '#0284c7',
    primaryLight: '#7dd3fc',
    secondary: '#818cf8', // Indigo/Purple accent
    accent: '#f59e0b', // Amber/Orange accent
    success: '#10b981', // Emerald green
    danger: '#ef4444', // Red
    warning: '#f59e0b',
    background: '#0f172a', // Dark navy background
    surface: '#1e293b', // Elevated surface background
    surfaceHighlight: '#334155', // Card highlight / borders
    cardBg: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    white: '#ffffff',
    black: '#000000',
    glassBg: 'rgba(30, 41, 59, 0.85)',
    overlay: 'rgba(15, 23, 42, 0.75)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    header: {
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '600',
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
    },
    small: {
      fontSize: 10,
      fontWeight: '600',
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export default theme;
