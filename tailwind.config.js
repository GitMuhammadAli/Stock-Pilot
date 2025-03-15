/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  animation: {
    "spin-slow": "spin 8s linear infinite",
    "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    "float": "float 6s ease-in-out infinite",
  },
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

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: "#B6F400",
        "primary-dark": "#9ED900",
        background: {
          dark: "#0B0F1A",
          light: "#1C2333",
        },
        card: "#2C3444",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 15px 5px rgba(182, 244, 0, 0.3)",
      },
    },
    plugins: [],  // Removed the tailwindcss-animate plugin
  }
