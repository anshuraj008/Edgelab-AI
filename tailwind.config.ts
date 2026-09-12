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
        coolTeal: {
          50: "#E6F7FC",
          100: "#CCEFF9",
          200: "#99DFF3",
          300: "#48CAE4",
          400: "#00B4D8", // Energetic Hover Teal
          500: "#0096C7", // Core Brand Cool Teal (#0096C7)
          600: "#0077B6", // Deep Active Teal
          700: "#023E8A",
          800: "#03045E",
          900: "#011A38",
          950: "#010F20",
        },
        icy: {
          50: "#FFFFFF",
          100: "#F1FAFE", // Crisp Icy White (#F1FAFE)
          200: "#E1F2FA",
          300: "#C5DBE8", // Secondary High-Contrast Slate
          400: "#9CBAD2",
          500: "#6B8EA8", // Muted Slate
          600: "#4A6D88",
        },
        cyber: {
          950: "#040810", // Deepest Cyber Void
          900: "#080E1A", // App Background
          850: "#0C1626", // Nav / Header / Footer
          800: "#101F35", // Card Background
          750: "#162844", // Elevated Surface / Input
          700: "#1D3456",
          600: "#26446E", // Hairline Border
          500: "#365D93", // Strong Border
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 24px -4px rgba(0, 0, 0, 0.7), 0 2px 8px -2px rgba(0, 150, 199, 0.3)",
        "teal-glow": "0 0 28px -4px rgba(0, 150, 199, 0.55)",
        "teal-sm": "0 0 14px -2px rgba(0, 150, 199, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
