import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        gurmukhi: ["GurmukhiMN", "sans-serif"],
        didot: ["var(--font-didot)", "serif"],
        didotbold: ["var(--font-didotbold)", "serif"],
        michroma: ["var(--font-michroma)", "sans-serif"],
        ivymode: ["var(--font-ivymode)", "serif"],
      },
      colors: {
        teal: {
          primary: "#1a7a96",
          dark: "#156680",
          light: "#2490b0",
        },
        brand: {
          dark: "#1a1a1a",
          charcoal: "#3d3d3d",
          "off-white": "#f8f5f0",
          cream: "#f5f0e8",
          "grey-mid": "#8b8b8b",
        },
        italian: {
          green: "#009246",
          red: "#ce2b37",
        },
      },
    },
  },
  plugins: [],
};

export default config;
