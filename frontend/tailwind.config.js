/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#070a12",
        surface: "rgba(13, 18, 30, 0.85)",
        surfaceLight: "rgba(22, 30, 48, 0.75)",
        panel: "#0b101d",
        borderMuted: "rgba(38, 52, 80, 0.7)",
        borderGlow: "rgba(56, 189, 248, 0.3)",
        accent: "#38bdf8",
        primary: "#f8fafc",
        secondary: "#94a3b8",
        live: "#10b981",
        demo: "#a855f7",
        cyberCyan: "#06b6d4",
        cyberBlue: "#3b82f6",
        cyberPurple: "#a855f7",
        cyberGreen: "#10b981",
        cyberAmber: "#f59e0b",
        cyberRed: "#ef4444",
        offline: "#64748b",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'soc': '0 12px 36px 0 rgba(0, 0, 0, 0.75)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.85), 0 0 20px 0 rgba(56, 189, 248, 0.15)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scanLine 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
