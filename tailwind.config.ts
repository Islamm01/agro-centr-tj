import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      colors: {
        agro: {
          DEFAULT: "#1a472a",
          dark: "#0d2e1a",
          light: "#e8f0ea",
        },
        gold: "#c8a84b",
      },
    },
  },
  plugins: [],
};

export default config;
