import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

// Check if we're in Lovable preview or localhost
const isPreviewEnvironment = () => {
  const hostname = window.location.hostname;
  return hostname.includes('lovable.app') || hostname.includes('localhost');
};

// Clear stale caches if they're older than 1 hour (for preview environment)
export const clearStaleCaches = async () => {
  if (!('caches' in window) || !isPreviewEnvironment()) return;
  
  const cacheNames = await caches.keys();
  const now = Date.now();
  
  // Check for our version marker in localStorage
  const lastClearTime = localStorage.getItem('pwa_cache_clear_time');
  const hourAgo = now - (60 * 60 * 1000);
  
  if (!lastClearTime || parseInt(lastClearTime) < hourAgo) {
    // Clear all workbox and js-assets caches
    for (const cacheName of cacheNames) {
      if (cacheName.includes('workbox') || cacheName.includes('js-assets')) {
        await caches.delete(cacheName);
      }
    }
    localStorage.setItem('pwa_cache_clear_time', now.toString());
  }
};

// Check for stale service worker and force update in preview environment
export const checkVersionAndUpdate = async () => {
  if (!isPreviewEnvironment() || !('serviceWorker' in navigator)) return;
  
  try {
    // First clear stale caches
    await clearStaleCaches();
    
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    
    // If there's a waiting worker, activate it immediately
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  } catch (e) {
    console.warn('Version check failed:', e);
  }
};

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
