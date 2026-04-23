/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff0f1',
          100: '#ffdde0',
          200: '#ffbfc4',
          300: '#ff929a',
          400: '#ff5662',
          500: '#f82535',
          600: '#c1272d',  // Brand crimson — from the VIVA logo
          700: '#a31f26',
          800: '#861a20',
          900: '#6e1419',
          950: '#3d0a0d',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Warm gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Warm neutrals — replace default gray which reads too cold
        warm: {
          50:  '#fafaf8',
          100: '#f5f3ef',
          200: '#e8e6e1',
          300: '#d6d2cb',
          400: '#a8a29c',
          500: '#7c7570',
          600: '#5c5650',
          700: '#423d38',
          800: '#2e2a26',
          900: '#1c1a16',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        impact:  ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['6rem',   { lineHeight: '0.88', letterSpacing: '0.02em' }],
        'display-lg': ['4.5rem', { lineHeight: '0.9',  letterSpacing: '0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '0.92', letterSpacing: '0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '0.95', letterSpacing: '0.02em' }],
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(28,20,16,.08), 0 8px 20px -4px rgba(28,20,16,.04)',
        'soft-lg': '0 10px 40px -10px rgba(28,20,16,.12), 0 2px 10px -2px rgba(28,20,16,.05)',
        'warm':    '0 4px 24px -4px rgba(193,39,45,.15), 0 1px 6px rgba(193,39,45,.06)',
        'glass':   '0 8px 32px 0 rgba(28,20,16,.07)',
        'glass-lg':'0 8px 32px 0 rgba(28,20,16,.15)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
