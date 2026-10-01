/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0E0F12',
        surface: {
          obsidian: '#0E0F12',
          dark: '#17181D',
          raised: '#22242B',
          hover: '#2C2E36',
          active: '#363842',
        },
        cine: {
          border: '#2A2C35',
          'border-active': '#FF5500',
          amber: '#FF5500',
          'amber-hover': '#E64D00',
          'amber-glow': '#FF5500',
          'amber-dark': '#CC4400',
          'amber-light': '#FF884D',
        },
        accent: {
          DEFAULT: '#FF5500',
          hover: '#E64D00',
          active: '#CC4400',
          muted: '#FF550020',
        },
        text: {
          primary: '#F4F4F0',
          secondary: '#D1D2D6',
          muted: '#A1A3A9',
          dim: '#71747C',
        },
        status: {
          success: '#10B981',
          danger: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'amber-glow': '0 0 20px -5px rgba(245, 158, 11, 0.35)',
        'amber-sm': '0 0 10px -2px rgba(245, 158, 11, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pan-right': 'panRight 3s ease-in-out infinite alternate',
        'tilt-up': 'tiltUp 3s ease-in-out infinite alternate',
        'orbit-cw': 'orbitCW 4s ease-in-out infinite alternate',
        'dolly-in': 'dollyIn 3s ease-in-out infinite alternate',
        'handheld': 'handheld 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        panRight: {
          '0%': { transform: 'translateX(-8px)' },
          '100%': { transform: 'translateX(8px)' },
        },
        tiltUp: {
          '0%': { transform: 'translateY(6px)' },
          '100%': { transform: 'translateY(-6px)' },
        },
        orbitCW: {
          '0%': { transform: 'rotate(-2deg) scale(1.02)' },
          '100%': { transform: 'rotate(2deg) scale(1.05)' },
        },
        dollyIn: {
          '0%': { transform: 'scale(1.0)' },
          '100%': { transform: 'scale(1.12)' },
        },
        handheld: {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(2px, -2px) rotate(0.4deg)' },
          '50%': { transform: 'translate(-2px, 1px) rotate(-0.3deg)' },
          '75%': { transform: 'translate(1px, 2px) rotate(0.2deg)' },
          '100%': { transform: 'translate(-1px, -1px) rotate(-0.2deg)' },
        },
      }
    },
  },
  plugins: [],
};
