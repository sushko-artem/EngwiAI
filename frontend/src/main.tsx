import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="container mx-auto px-3 sm:px-4 lg:px-5 max-w-7xl">
      <div className="fixed inset-0 -z-10 backdrop-blur-[6px]"></div>
      <App />
    </div>
  </StrictMode>
);
