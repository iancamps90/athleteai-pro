import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007AFF",
          dark: "#0A84FF",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FF6A00",
          dark: "#FF9F0A",
          foreground: "#0f0f0f",
        },
        neutral: {
          50: "#f5f7fb",
          100: "#edf0f6",
          200: "#d9deeb",
          300: "#b8c0d5",
          400: "#8e9bb7",
          500: "#6d7b9b",
          600: "#525d7a",
          700: "#3f4760",
          800: "#2a3042",
          900: "#161a27",
        },
        success: {
          DEFAULT: "#2CC197",
          dark: "#0E9F73",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#FFB020",
          dark: "#FF8A15",
          foreground: "#0f0f0f",
        },
        danger: {
          DEFAULT: "#FF4D4F",
          dark: "#D9363E",
          foreground: "#ffffff",
        },
        "surface-elevated": "rgba(255, 255, 255, 0.85)",
        "surface-glass": "rgba(255, 255, 255, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        soft: "0 24px 60px -32px rgba(10, 132, 255, 0.35)",
      },
      backgroundImage: {
        "gradient-blue": "linear-gradient(135deg, #0A84FF 0%, #7B61FF 100%)",
        "gradient-orange": "linear-gradient(135deg, #FF6A00 0%, #FF9F0A 100%)",
        "gradient-green": "linear-gradient(135deg, #2CC197 0%, #12A584 100%)",
        "gradient-surface":
          "linear-gradient(160deg, rgba(10, 132, 255, 0.12) 0%, rgba(123, 97, 255, 0.12) 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-out forwards",
        "scale-in": "scale-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;

