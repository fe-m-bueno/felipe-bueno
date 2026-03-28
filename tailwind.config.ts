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
      backgroundImage: {
        'main': 'url("/bg-main.webp")',
        'main-dark': 'url("/bg-main-dark.webp")',
        'main-mobile': 'url("/bg-main.webp")',
        'main-dark-mobile': 'url("/bg-main-dark.webp")',
      },
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
