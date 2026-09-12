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
        cyprus: {
          50: "#e6f2f0",
          100: "#cce5e1",
          200: "#99cbc3",
          300: "#66b1a5",
          400: "#339787",
          500: "#007d69",
          600: "#006454",
          700: "#004741", // Primary brand Cyprus
          800: "#003632",
          900: "#002421",
          950: "#001211",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F5F2EA", // App Canvas warm sand
          200: "#EAE5D9",
          300: "#DDD6C5",
          400: "#C8BEA8",
          500: "#A89C83",
          600: "#877B63",
          700: "#665C47",
          800: "#473F30",
          900: "#2B261C",
        },
        provenance: {
          user: "#1D4ED8", // Blue
          assumption: "#B45309", // Amber
          clarified: "#047857", // Emerald
          derived: "#6D28D9", // Purple
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "workbench": "0 10px 25px -5px rgba(0, 71, 65, 0.06), 0 8px 10px -6px rgba(0, 71, 65, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
