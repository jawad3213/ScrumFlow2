/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Identity (Expanded with scales for states)
        brand: {
          primary: {
            50: "#EEF2FF",
            100: "#E0E7FF",
            500: "#5D5FEF", // Original Base
            600: "#4F46E5", // Hover
            700: "#4338CA", // Active/Dark
          },
          secondary: {
            50: "#FFFBEB",
            500: "#FEAA09", // Original Base
            600: "#D97706",
            700: "#B45309",
          },
        },
        // Refined Neutrals
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        // Semantic Colors (Unified naming for better DX)
        success: {
          lighter: "#DCFCE7",
          default: "#10B981",
          darker: "#166534",
        },
        warning: {
          lighter: "#FEF3C7",
          default: "#FBBF24",
          darker: "#92400E",
        },
        danger: {
          lighter: "#FEE2E2",
          default: "#EF4444",
          darker: "#991B1B",
        },
        info: {
          lighter: "#DBEAFE",
          default: "#3B82F6",
          darker: "#1E40AF",
        },
        // Surface & UI Elements
        surface: {
          background: "#F8F9FD",
          card: "#FFFFFF",
          sidebar: "#FFFFFF",
          border: "#E5E7EB",
          overlay: "rgba(0, 0, 0, 0.4)",
          muted: "#F3F4F6",
        },
        // Analytics/Charts
        chart: {
          sale: "#3B82F6",
          distribute: "#FBBF24",
          return: "#F87171",
          path: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        // Unified Layout & Component Spacing
        'section': '4rem',    
        'container': '1.5rem', 
        
        // Button Padding Tokens
        'btn-py-sm': '0.375rem',
        'btn-px-sm': '0.75rem',
        'btn-py-md': '0.625rem',
        'btn-px-md': '1.25rem',
        'btn-py-lg': '0.875rem',
        'btn-px-lg': '1.75rem',

        // Form & Card Tokens
        'card-p': '1.5rem',
        'input-p': '0.75rem',

        // Standard Scale
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
      },
      borderRadius: { 
        none: "0",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        pill: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        card: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        dropdown: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        elevation: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)",
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1100",
        modal: "1300",
        tooltip: "1500",
      },
      transitionProperty: {
        'ui': "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
      },
      transitionDuration: {
        'default': '200ms',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}