import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary rose pink
        primary: {
          DEFAULT: '#C2185B',
          50:  '#FFF0F5',
          100: '#FFD6E7',
          200: '#FFB3D0',
          300: '#FF7FB0',
          400: '#F04887',
          500: '#C2185B',
          600: '#A01050',
          700: '#7E0D40',
          800: '#5C0A30',
          900: '#3A0620',
        },
        // Accent gold
        accent: {
          DEFAULT: '#F9A825',
          50:  '#FFFBF0',
          100: '#FFF3CC',
          200: '#FFE499',
          300: '#FFD566',
          400: '#FFC533',
          500: '#F9A825',
          600: '#D4900F',
          700: '#A86E08',
          800: '#7C4E04',
          900: '#502F01',
        },
        // Backgrounds
        'cake-light': '#FFF5F8',
        'cake-dark':  '#110609',
        // Card backgrounds
        'card-light': '#FFFFFF',
        'card-dark':  '#1E0C12',
        // Border
        'border-light': '#F3D0DC',
        'border-dark':  '#3D1525',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        dmsans:   ['var(--font-dmsans)', 'system-ui', 'sans-serif'],
        dancing:  ['var(--font-dancing)', 'cursive'],
      },
      backgroundImage: {
        'gradient-rose':  'linear-gradient(135deg, #C2185B 0%, #F9A825 100%)',
        'gradient-soft':  'linear-gradient(180deg, #FFF5F8 0%, #FFE4EF 100%)',
        'gradient-dark':  'linear-gradient(180deg, #110609 0%, #1E0C12 100%)',
      },
      boxShadow: {
        'card':      '0 4px 24px rgba(194,24,91,0.08)',
        'card-hover':'0 8px 40px rgba(194,24,91,0.18)',
        'glow':      '0 0 24px rgba(194,24,91,0.30)',
      },
      animation: {
        'slide-in-up':   'slideInUp 0.4s ease-out',
        'fade-in':       'fadeIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'spin-slow':     'spin 3s linear infinite',
      },
      keyframes: {
        slideInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
