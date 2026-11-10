import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        poko: {
          charcoal: "#1f1f1f",
          linen: "#f6f7ed",
          canvas: "#f4f4f4",
          card: "#ffffff",
          border: "#e5e7eb",
          muted: "#71717a",
          accent: "#10b981", // Emerald / WhatsApp
          darkCard: "#292929",
          amber: "#f59e0b",
          blue: "#3b82f6"
        },
      },
      fontFamily: {
        sans: ["General Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "subtle": "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
        "card": "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      }
    },
  },
  plugins: [],
};
export default config;
