/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
        "2xl": {"max": "1699px"},
        xl: {"max": "1440px"},
        lg: {"max": "975px"},
        md: {"max": "768px"},
        s: {"max": "480px"},
        xs: {"max": "280px"},
      // "mobile-landscape": {"min": "650px", "max": "1000px"},
      // "ipad-landscape": {"min": "1000px", "max": "1200px"},
    },
    extend: {
      fontSize: {
        base: "1.1rem",
      },
      fontFamily: {
        primary: ["Dosis", "sans-serif"],
        secondary: ["Segoe UI"],
      },
      colors: {
        primary: "#95002B",
        secondary: "#FFC0CB",
        tertiary: "#F5F1F1",
      },
    }
  },
  plugins: [],
};