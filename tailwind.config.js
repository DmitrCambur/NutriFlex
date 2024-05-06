/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5F5F5",
        secondary: {
          DEFAULT: "#191919",
        },
        green: {
          DEFAULT: "#54FF65",
        },
        orange: {
          DEFAULT: "#FF9E54",
        },
        red: {
          DEFAULT: "#FF4747",
        },
      },
      fontFamily: {
        jextralight: ["JetBrainsMono-ExtraLight", "sans-serif"],
        jlight: ["JetBrainsMono-Light", "sans-serif"],
        jbold: ["JetBrainsMono-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
