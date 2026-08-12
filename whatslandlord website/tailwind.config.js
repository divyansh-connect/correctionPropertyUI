/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#2563EB',
            dark: '#1D4ED8',
            light: '#DBEAFE',
            surface: '#EFF6FF',
          },
          slate: {
            DEFAULT: '#F8FAFC',
            muted: '#F1F5F9',
            accent: '#E2E8F0',
            surface: '#FFFFFF',
          },
          indigo: {
            DEFAULT: '#4F46E5',
            dark: '#3730A3',
            light: '#818CF8',
            surface: '#EEF2FF',
          },
          neutral: {
            dark: '#0F172A',
            muted: '#475569',
            light: '#64748B',
            border: '#E2E8F0',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(37, 99, 235, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(37, 99, 235, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'hero-card': '0 20px 50px -10px rgba(37, 99, 235, 0.15)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
