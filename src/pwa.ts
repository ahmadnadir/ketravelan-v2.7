import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

// Clear all caches and unregister service workers, then reload
export const clearCacheAndReload = async () => {
  try {
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
  
  // Force reload from server
  window.location.reload();
};

// Register service worker with aggressive update handling
export const initPWA = () => {
  const updateSW = registerSW({
    immediate: true, // Check for updates immediately on load
    onNeedRefresh() {
      // Auto-reload after brief toast notification
      toast("Updating app...", { 
        description: "Please wait while we load the latest version.",
        duration: 1500 
      });
      setTimeout(() => {
        updateSW(true);
      }, 1500);
    },
    onOfflineReady() {
      toast.success("App ready for offline use", {
        description: "You can now use Ketravelan without an internet connection.",
        duration: 3000,
      });
    },
    onRegistered(registration) {
      // Check for updates periodically (every 30 minutes)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  // Also trigger an immediate update check
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.update().catch(err => {
        console.warn("SW update check failed:", err);
      });
    });
  }
};
