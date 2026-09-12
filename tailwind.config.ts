import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        madder: {
          50: "#FDF2F3",
          100: "#FCE6E8",
          200: "#F9B3B8",
          300: "#F58089",
          400: "#EE4D5A",
          500: "#E62E3B",
          600: "#C01E2A", // Hover Madder
          700: "#A21721", // Core Brand Madder
          800: "#7F1018",
          900: "#5A0B10",
          950: "#380509",
        },
        snow: {
          DEFAULT: "#FCF8F9",
          50: "#FFFFFF",
          100: "#FCF8F9", // Crisp Snow Text
          200: "#F4EAEF",
          300: "#E8D8E0",
          400: "#C9BFC4", // Secondary Text
          500: "#8E8087", // Muted Text
        },
        obsidian: {
          950: "#080607",
          900: "#0C0A0B", // App background
          850: "#120E10", // Header / Nav
          800: "#181316", // Card background
          750: "#20191E", // Elevated surface / input
          700: "#2B2026",
          600: "#3A2B33", // Hairline border
          500: "#4D3A44", // Strong border
        },
        status: {
          success: "#21D69B",
          warning: "#E5A93C",
          error: "#F05D68",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(162, 23, 33, 0.2)",
        "madder-glow": "0 0 25px -4px rgba(162, 23, 33, 0.45)",
        "madder-sm": "0 0 14px -2px rgba(162, 23, 33, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
