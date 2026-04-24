import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { PlannedTripPopupProvider } from "./context/PlannedTripPopupContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <PlannedTripPopupProvider>
          <App />
        </PlannedTripPopupProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
