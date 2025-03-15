/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        "bg-primary": "#0B0F1A",
        "bg-secondary": "#1C2333",
        "bg-tertiary": "#2C3444",
        
        // Brand colors
        "brand-primary": "#B6F400",
        "brand-primary-hover": "#9ED900",
        
        // Status colors
        "status-error": "#EF4444",
        "status-success": "#10B981",
      },
      textColor: {
        primary: "#FFFFFF",
        secondary: "#B6F400",
        muted: "#9CA3AF",
      },
      borderColor: {
        primary: "#2C3444",
      },
    },
  },
  plugins: [],
}
