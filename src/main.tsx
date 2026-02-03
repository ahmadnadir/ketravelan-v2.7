import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Initialize PWA with aggressive cache invalidation for preview environment
import { initPWA, checkVersionAndUpdate } from "./pwa";

// Support deep links on static hosting by handling redirects from /404.html
// 404.html redirects unknown paths to /?redirect=<originalPath>
(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirect");
    if (!redirectParam) return;

    const target = decodeURIComponent(redirectParam);

    // Only allow internal redirects (avoid open-redirect abuse)
    if (target.startsWith("/") && !target.startsWith("//")) {
      window.history.replaceState(null, "", target);
    }
  } catch {
    // no-op
  }
})();

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
