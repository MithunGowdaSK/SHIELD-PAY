import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      {/* ✅ Everything is inside the render tree */}
      <>
        <App />
        <Toaster position="top-center" />
      </>
    </AppProvider>
  </BrowserRouter>
);
