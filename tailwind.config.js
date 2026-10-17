import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
        serif: [
          'ui-serif',
          'Georgia',
          'Cambria',
          'Songti SC',
          'Noto Serif SC',
          'serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      maxWidth: {
        content: '1120px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 400ms ease-out both',
        'scale-in': 'scale-in 200ms ease-out both',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#3f3f46',
            a: {
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '500',
            },
            'a:hover': { textDecoration: 'underline' },
            'h1, h2, h3, h4': {
              color: '#18181b',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            code: {
              backgroundColor: '#f4f4f5',
              borderRadius: '0.375rem',
              padding: '0.15rem 0.35rem',
              fontWeight: '500',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: {
              backgroundColor: '#18181b',
              color: '#e4e4e7',
              borderRadius: '0.75rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              fontWeight: '400',
            },
            blockquote: {
              borderLeftColor: '#bfdbfe',
              color: '#52525b',
              fontStyle: 'normal',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
            hr: { borderColor: '#e4e4e7' },
            th: { color: '#18181b' },
            'thead th': { borderBottomColor: '#e4e4e7' },
            'tbody td': { borderBottomColor: '#f4f4f5' },
          },
        },
      },
    },
  },
  plugins: [typography],
}
