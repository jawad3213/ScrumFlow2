/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#feaa09",
          secondary: "#fe5c73",
          dark: "#343c6a",
          blue: "#2d60ff",
          muted: "#EEF2FF",
        },
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
          900: "#000000",
        },
        semantic: {
          success: {
            bg: "#DCFCE7",
            text: "#166534",
            border: "#BBF7D0",
            solid: "#10B981",
          },
          warning: {
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FDE68A",
            solid: "#FBBF24",
          },
          danger: {
            bg: "#FEE2E2",
            text: "#991B1B",
            border: "#FECACA",
            solid: "#EF4444",
          },
          info: {
            bg: "#DBEAFE",
            text: "#1E40AF",
            border: "#BFDBFE",
            solid: "#3B82F6",
          },
        },
        chart: {
          sale: "#3B82F6",
          distribute: "#FBBF24",
          return: "#F87171",
          path: "#A855F7",
        },
        surface: {
          background: "#F8F9FD",
          card: "#FFFFFF",
          sidebar: "#FFFFFF",
          muted: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["13px", { lineHeight: "1rem" }],
        sm: ["15px", { lineHeight: "1.25rem" }],
        base: ["16px", { lineHeight: "1.5rem" }],
        lg: ["18px", { lineHeight: "1.75rem" }],
        xl: ["20px", { lineHeight: "1.75rem" }],
        "2xl": ["22px", { lineHeight: "2rem" }],
        "3xl": ["28px", { lineHeight: "2.25rem" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        1: "0.25rem",
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
        elevation: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)",
        custom: "4px 4px 18px -2px rgba(231, 228, 232, 0.8)",
      },
      backgroundImage: {
        'brand-gradient': "linear-gradient(136deg, #123288 0%, #295eec 100%)",
      },
    },
  },
  plugins: [],
}
