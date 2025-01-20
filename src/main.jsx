import React, { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { ProfileLoginProvider } from "./components/constants/context.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProfileLoginProvider>
        <App />
      </ProfileLoginProvider>
    </BrowserRouter>
  </React.StrictMode>
);