import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Initialize PWA with aggressive cache invalidation for preview environment
import { initPWA, checkVersionAndUpdate } from "./pwa";

// Check for stale service worker BEFORE app renders (preview-only)
checkVersionAndUpdate();

// Initialize PWA (handles subsequent updates)
initPWA();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Initialize Capacitor plugins after React mounts (non-blocking)
import("./lib/capacitor").then(({ initializeCapacitor }) => {
  initializeCapacitor();
});
