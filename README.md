# Project Exam 2
Johan Lossius Project Exam 2 for Frontend & UX Noroff.

# Shout out to Noroff
Before going into the details of how to get started, I'd like to thank Noroff for helping me throughout these 4 years with the studies.
It has been a great experience for me, even though it has been digital and with limited live interaction.
Hugely appreciated!

# Getting started with the development:
- Clone the repo from GitHub via GitHub Desktop:
clone https://github.com/JohanLossius/holidaze.git
If you are using GitHub Desktop and Visual Studio Code editor, simply launch and install it via GitHub Desktop by pulling it from the GitHub repo and follow the instructions of the program until you're setup in Visual Studio Code.
- And then install it. Run:
```
npm i
```

# Technologies
This project was built with React v18.3.1, Tailwind v3.4.16, Vite v6.0.1 and some other technologies that can be seen in the package.json file.

# Styling
Tailwind is used mostly out of the box, only with a few custom configs in the tailwind.config.js file.
Some custom css is used to be able to target the booking calendar installed with npm.

Holidaze was built for being fun, creative and creating good vibes and memories.
This should be kept in mind for when continuing to develop it, to maintain the good vibes of amazing experiences.

# Getting Started with React & Vite

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

I had to use the following in my vite.config.js file to make ensure vite picked up changes with HMR:
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

# License
No licenses in particular for this repo, but please credit me if you decide to use any of the design I've created.

# Contributions
I've asked for help from instructors occasionally when I've had questions or challenges to deal with, so thanks a lot to those concerned.
