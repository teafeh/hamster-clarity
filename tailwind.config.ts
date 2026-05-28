import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Space Grotesk: clean, modern feel for Nigerian SME product
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand palette — single source of truth for the whole app.
        // All components reference these tokens, never raw hex values.
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',   // primary action
          600: '#16a34a',   // primary hover
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Neutral surface scale
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      borderRadius: {
        // Consistent rounding scale used across all components
        'sm':   '6px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '20px',
      },
      boxShadow: {
        // Subtle elevation — used for cards and modals only
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'modal': '0 20px 60px -10px rgb(0 0 0 / 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
