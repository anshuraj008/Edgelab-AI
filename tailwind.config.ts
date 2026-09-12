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
        midnight: {
          950: "#070B1A",
          900: "#0A0F23", // App background
          850: "#0D1328", // Sidebar / header / footer
          800: "#11182E", // Card background
          750: "#151D36", // Elevated surface / input
          700: "#1C2646",
          600: "#232D48", // Border
          500: "#34405F", // Strong border
        },
        violet: {
          accent: "#7E3BED", // Primary accent
          hover: "#8D55F5",  // Accent hover
          soft: "#7E3BED1A", // Accent soft (10% opacity)
          glow: "#7E3BED33", // Accent glow (20% opacity)
        },
        slate: {
          textPrimary: "#F8F9FC",   // Primary text
          textSecondary: "#A7AFC3", // Secondary text
          textMuted: "#737D96",     // Muted text
        },
        status: {
          success: "#21D69B", // Mint / emerald
          warning: "#F4B740", // Amber / gold
          error: "#F05D68",   // Soft red / crimson
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 4px 12px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -2px rgba(126, 59, 237, 0.15)",
        "violet-glow": "0 0 25px -5px rgba(126, 59, 237, 0.35)",
        "violet-sm": "0 0 12px -2px rgba(126, 59, 237, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
