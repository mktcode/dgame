/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        25: "repeat(25, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
