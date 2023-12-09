/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {DEFAULT: "#2E4374"},
        secondary: {DEFAULT: "#4B527E"},
        accent: {DEFAULT: "#f4c195"},
        offset: {DEFAULT: "#7C81AD"},
        tertiary: {},
        dark: {},
        light: {},
        success: {},
        warning: {},
        danger: {},
        info: {},
        white: {DEFAULT: "#fff"},
        black: {DEFAULT: "#000"},
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'sans'],
        handlee: ['var(--font-handlee)'],
        serif: [],
        mono: [],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        ["infinite-slider"]: "infiniteSlider 5s linear infinite",
      },
      keyframes: {
        infiniteSlider: {
          "0%": { transform: "translateX(0)" },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
}
