# Project Exam 2
Johan Lossius Project Exam 2 for Frontend & UX Noroff.

# Styling
Tailwind is used with a few extension of the theme.
Some custom css is used to be able to target the booking calendar installed with npm.

# Getting Started with Vite

This project was built with React and Vite. Some instructions for setting up with React and Vite here:
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173/](http://localhost:5173/) to view it in your browser.
(Or whatever local host URL that it runs on for your setup.)

The page will reload when you make changes.
Please note:

I had to use the following in my vite.config.js file to make ensure vite picked up changes:
```
server: {
  watch: {
    usePolling: true, // Enables polling to pick up file changes
    interval: 100,    // Polling interval in milliseconds
  },
},
```

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.