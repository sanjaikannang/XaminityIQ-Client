import "./global.css";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./app/providers/AppProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <>
        <AppProvider>
            <App />
        </AppProvider>
    </>
);