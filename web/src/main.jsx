import React from "react";
import { createRoot } from "react-dom/client";
import "xp.css/dist/XP.css";
import "./shared/styles/global.css";
import { App } from "./app/App.jsx";

createRoot(document.getElementById("root")).render(<App />);
