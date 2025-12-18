import "./global.css";
import App from "./app.tsx";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./app/providers/AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <>
        <AppProvider>
            <App />
        </AppProvider>
    </>
);