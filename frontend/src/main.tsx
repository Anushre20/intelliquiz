import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("VITE ENV OBJECT:", import.meta.env);

createRoot(document.getElementById("root")!).render(<App />);
