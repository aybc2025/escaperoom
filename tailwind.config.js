/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          deep: '#0B0E2D',
          mid: '#141852',
          light: '#1E2266',
        },
        accent: {
          cyan: '#4EEADD',
          purple: '#A78BFA',
          orange: '#FF8A5C',
        },
        ui: {
          text: '#F0F0F0',
          dim: '#8B8FAD',
          success: '#4ADE80',
          danger: '#FF6B6B',
        },
      },
      fontFamily: {
        display: ['Rubik', 'Heebo', 'sans-serif'],
        body: ['Heebo', 'sans-serif'],
      },
      fontSize: {
        'game-sm': ['1.125rem', { lineHeight: '1.6' }],   /* 18px min */
        'game-base': ['1.25rem', { lineHeight: '1.6' }],   /* 20px */
        'game-lg': ['1.5rem', { lineHeight: '1.4' }],      /* 24px */
        'game-xl': ['2rem', { lineHeight: '1.3' }],        /* 32px */
        'game-2xl': ['2.5rem', { lineHeight: '1.2' }],     /* 40px */
        'game-3xl': ['3.5rem', { lineHeight: '1.1' }],     /* 56px */
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'twinkle-slow': 'twinkle 5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-in-slow': 'fade-in 0.8s ease-out',
        'spark': 'spark 0.6s ease-out forwards',
        'sand-flow': 'sand-flow 1s linear infinite',
        'confetti': 'confetti 1s ease-out forwards',
        'engine-glow': 'engine-glow 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spark: {
          '0%': { opacity: '1', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
          '100%': { opacity: '0', transform: 'scale(2)' },
        },
        'sand-flow': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        confetti: {
          '0%': { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateY(-100px) rotate(720deg)' },
        },
        'engine-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scaleY(1)' },
          '50%': { opacity: '1', transform: 'scaleY(1.3)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
