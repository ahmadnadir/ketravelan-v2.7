import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Initialize PWA only in production (not in preview/localhost)
import { initPWA, checkVersionAndUpdate } from "./pwa";

const isProduction = !window.location.hostname.includes('lovable.app')
  && !window.location.hostname.includes('localhost');

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

if (isProduction) {
  // Check for stale service worker BEFORE app renders
  checkVersionAndUpdate();
  // Initialize PWA (handles subsequent updates)
  initPWA();
} else {
  // Clean up any existing service workers from previous sessions
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs =>
      regs.forEach(reg => reg.unregister())
    );
  }
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Initialize Capacitor plugins after React mounts (non-blocking)
import("./lib/capacitor").then(({ initializeCapacitor }) => {
  initializeCapacitor();
});
