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
      },
      colors: {
        primary: "#95002B",
        secondary: "#FDA4B1",
        tertiary: "#F5F1F1",
      },
    //   screens: {
    //     "2xl": {"min": "1700px"},
    //     "xl": {"max": "1699px"},
    //     "lg": {"max": "1439px"},
    //     "md": {"max": "975px"},
    //     "s": {"max": "767px"},
    //     "xs": {"max": "479px"},
    //     "xxs": {"max": "279px"},
    //     "mobile-landscape": {"min": "650px", "max": "1000px"},
    //     "ipad-landscape": {"min": "1000px", "max": "1200px"},
    //   }
    }
  },
  plugins: [],
};


// ujnused code

// primary: ["Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "sans-serif"],
// secondary: ["Arvo", "Times New Roman", "serif"],