/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
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
      }
    },
  },
  plugins: [],
};


// ujnused code

// primary: ["Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "sans-serif"],
// secondary: ["Arvo", "Times New Roman", "serif"],