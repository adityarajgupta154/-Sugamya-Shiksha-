/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="high-contrast"]'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#627D98",
          500: "#334E68",
          600: "#243B53",
          700: "#162B48",
          800: "#0F2137", // Primary Deep Navy
          900: "#0A1626",
          950: "#050B13",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D7A75", // AA Safe Primary Accent
          700: "#0A5C58", // AAA Safe Dark Accent
          800: "#07423F",
          900: "#042B29",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309", // AA Safe on light
          800: "#92400E", // AAA Safe on light
          900: "#78350F",
        },
        offwhite: {
          DEFAULT: "#F8F9FA",
          warm: "#F5F6F8",
          card: "#FFFFFF",
          muted: "#ECEFF2",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-devanagari)",
          "Inter",
          "Noto Sans Devanagari",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        hindi: [
          "var(--font-noto-sans-devanagari)",
          "Noto Sans Devanagari",
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(15, 33, 55, 0.06), 0 1px 2px -1px rgba(15, 33, 55, 0.04)",
        card: "0 4px 6px -1px rgba(15, 33, 55, 0.07), 0 2px 4px -2px rgba(15, 33, 55, 0.05)",
        elevated: "0 10px 15px -3px rgba(15, 33, 55, 0.08), 0 4px 6px -4px rgba(15, 33, 55, 0.04)",
        focus: "0 0 0 3px rgba(13, 122, 117, 0.45)",
      },
    },
  },
  plugins: [],
};
