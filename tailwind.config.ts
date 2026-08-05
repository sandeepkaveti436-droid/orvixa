import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: "#2563EB",
          hover: "#1D4ED8",
          active: "#1E40AF",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          purple: "#7C3AED",
          cyan: "#06B6D4",
        },
      },
      borderRadius: {
        button: "14px",
        input: "14px",
        card: "20px",
        modal: "24px",
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
