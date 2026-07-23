import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F766E",
          dark: "#0B5A54",
          light: "#14B8A6",
        },
        surface: {
          DEFAULT: "#F7F8FA",
          card: "#FFFFFF",
          border: "#EFF1F4",
        },
        status: {
          available: { bg: "#DCFCE7", fg: "#16A34A" },
          "in-use": { bg: "#FEF3C7", fg: "#B45309" },
          maintenance: { bg: "#FEE2E2", fg: "#DC2626" },
          offline: { bg: "#E5E7EB", fg: "#4B5563" },
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)",
      },
      screens: {
        desktop: "880px",
      },
    },
  },
  plugins: [],
};

export default config;
