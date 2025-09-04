import React from "react";
import { createRoot } from "react-dom/client";
import TerminalPortfolio from "./TerminalPortfolio";
import "./index.css"; // <- required so Tailwind CSS is applied

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TerminalPortfolio />
  </React.StrictMode>
);

