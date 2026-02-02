

## Fix: Aggressive PWA Cache Invalidation for Lovable Preview

### Problem Analysis

The app shows a 404 page and old bottom navigation ("Expenses" instead of "Community") when reopening the Lovable preview because:

1. **Service Worker caches stale JavaScript bundles** - The PWA precaches all assets including JS files. When you make code changes, a new bundle is generated, but the service worker still serves the old cached version on the initial load.

2. **The update check happens too late** - By the time `onNeedRefresh()` fires, the stale bundle has already loaded and rendered the wrong UI.

3. **Lovable preview rebuilds frequently** - Every code change creates a new build, but the service worker doesn't know about it until after loading the cached version.

### Solution: Force Fresh Bundles on Every Load in Preview

We need to make the PWA more aggressive about checking for updates **before** rendering, especially in the Lovable preview environment.

---

### Technical Changes

#### 1. Add Stale-While-Revalidate with Immediate Reload for JS Assets

**File**: `vite.config.ts`

Add a runtime caching rule for JavaScript assets that forces a network check on every load:

```typescript
runtimeCaching: [
  // Force network-first for JS bundles to prevent stale code
  {
    urlPattern: /\.js$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "js-assets",
      networkTimeoutSeconds: 3, // Fall back to cache after 3s
      expiration: {
        maxAgeSeconds: 60 * 60, // 1 hour max
      },
    },
  },
  // Existing unsplash images rule...
]
```

#### 2. Add Version Check on App Load

**File**: `src/pwa.ts`

Add a mechanism to detect stale bundles and force reload immediately:

```typescript
// Add build version checking
const BUILD_VERSION = import.meta.env.VITE_BUILD_TIMESTAMP || Date.now().toString();

export const checkVersionAndUpdate = async () => {
  // In Lovable preview, always check for fresh content
  const isLovablePreview = window.location.hostname.includes('lovable.app') ||
                           window.location.hostname.includes('localhost');
  
  if (isLovablePreview && 'serviceWorker' in navigator) {
    try {
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
  }
};
```

#### 3. Trigger Version Check Early in App Load

**File**: `src/main.tsx`

Call the version check before rendering the app:

```typescript
import { initPWA, checkVersionAndUpdate } from "./pwa";

// Check for stale service worker before app renders
checkVersionAndUpdate();

// Initialize PWA (handles subsequent updates)
initPWA();
```

#### 4. Add Service Worker Message Handler for Immediate Activation

**File**: `vite.config.ts`

Update the Workbox configuration to listen for the SKIP_WAITING message:

```typescript
workbox: {
  skipWaiting: true,
  clientsClaim: true,
  // ... existing config ...
}
```

Note: `skipWaiting: true` is already set, but we'll add explicit messaging support.

#### 5. Clear Old Caches on App Start (Fallback)

**File**: `src/pwa.ts`

Add a function that clears potentially stale caches when the app detects a mismatch:

```typescript
// Clear stale caches if they're older than 1 hour
export const clearStaleCaches = async () => {
  if (!('caches' in window)) return;
  
  const cacheNames = await caches.keys();
  const now = Date.now();
  
  // Check for our version marker in localStorage
  const lastClearTime = localStorage.getItem('cache_clear_time');
  const hourAgo = now - (60 * 60 * 1000);
  
  if (!lastClearTime || parseInt(lastClearTime) < hourAgo) {
    // Clear all workbox caches
    for (const cacheName of cacheNames) {
      if (cacheName.includes('workbox') || cacheName.includes('js-assets')) {
        await caches.delete(cacheName);
      }
    }
    localStorage.setItem('cache_clear_time', now.toString());
  }
};
```

---

### Files to Modify

| File | Change |
|------|--------|
| `vite.config.ts` | Add NetworkFirst caching for JS bundles |
| `src/pwa.ts` | Add `checkVersionAndUpdate()` and `clearStaleCaches()` functions |
| `src/main.tsx` | Call version check before app renders |

---

### Why This Works

1. **NetworkFirst for JS** - Instead of serving cached JS first, always try the network. Only fall back to cache if network fails (offline/slow).

2. **Early version check** - Before the React app even renders, we check if there's a newer service worker waiting and activate it immediately.

3. **Stale cache cleanup** - Periodically clear old caches to prevent buildup of outdated assets.

4. **Lovable-aware detection** - Only apply aggressive checks in Lovable preview/localhost, not in production where aggressive caching is beneficial.

---

### Expected Behavior After Fix

| Scenario | Before | After |
|----------|--------|-------|
| Reopen preview after code change | Shows 404 + old navbar | Loads fresh version immediately |
| Open after being away 1+ hour | Stale cached version | Clears old cache, loads fresh |
| Offline revisit | Shows 404 | Falls back to cached version (intended for PWA) |
| Production site | Same as preview | Cached for performance, updates on refresh |

