import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SettingsProvider } from "./contexts/GameSettingsCtx";

import "./styles/style.css";

import App from "./routes/home/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <SettingsProvider>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
