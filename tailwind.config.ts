import type { Config } from "tailwindcss";
import fluid, { extract, screens, fontSize } from "fluid-tailwind";

const config: Config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: {
    files: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    extract,
  },

  theme: {
    screens,
    fontSize,
    extend: {
      screens: {
        xsm: "8rem",
        xs: "20rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        "space-grotesk": ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [fluid],
};

export default config;
