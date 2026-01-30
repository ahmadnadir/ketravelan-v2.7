

## Fix PWA Cache Issue Causing 404 Errors

### Problem Analysis

The 404 errors on `/community` and `/welcome` routes are caused by stale service worker caches:

1. **Stale JS bundles**: When new routes are deployed, the service worker continues serving old cached JavaScript that doesn't include the new route definitions
2. **Silent failures**: The `registerType: "autoUpdate"` should auto-update, but the toast notification for updates can be missed or dismissed
3. **No immediate cache bust**: Users seeing 404s are stuck on old versions until they manually reload

### Root Cause

The current PWA configuration relies on users to:
1. Notice the "Update available" toast
2. Click the "Reload" button

If they miss this, they stay on the old cached version indefinitely.

---

### Solution: Aggressive Cache Invalidation on Navigation Errors

Implement a multi-layered fix:

1. **Auto-skip waiting service worker** - Force new service workers to activate immediately
2. **Detect stale routes** - When React Router hits a 404 on a known route, trigger cache refresh
3. **Force update on mount** - Check for updates immediately when app loads, not just every 30 minutes

---

### Changes Required

#### 1. Update `vite.config.ts` - Force immediate service worker activation

**Current issue**: New service workers wait until all tabs are closed before activating.

**Change**: Add `skipWaiting: true` and `clientsClaim: true` to workbox config:

```text
workbox: {
  skipWaiting: true,      // NEW: Don't wait, activate immediately
  clientsClaim: true,     // NEW: Take control of all pages immediately
  globPatterns: [...],
  ...
}
```

This ensures new service workers activate immediately without waiting.

---

#### 2. Update `src/pwa.ts` - Immediate update check + auto-reload

**Changes:**
- Check for updates immediately on load (not just every 30 min)
- Auto-reload when update is available (optional toast first)
- Add a function to force cache clear and reload

```text
export const initPWA = () => {
  const updateSW = registerSW({
    immediate: true,  // Check immediately
    onNeedRefresh() {
      // Auto-reload after brief delay (give toast time to show)
      toast("Updating app...", { duration: 1500 });
      setTimeout(() => updateSW(true), 1500);
    },
    ...
  });
  
  // Also check immediately on init
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => reg.update());
  }
};

// Export function for manual cache clear
export const clearCacheAndReload = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(reg => reg.unregister()));
  }
  window.location.reload();
};
```

---

#### 3. Update `src/pages/NotFound.tsx` - Smart cache clear on known routes

**Logic**: If user lands on 404 for a route that SHOULD exist (like `/community`), auto-clear cache and reload.

**Changes:**
- Define list of valid routes
- Check if current path matches a valid route pattern
- If yes, auto-trigger cache clear (with toast notification)
- If no, show normal 404 page

```text
const VALID_ROUTES = [
  '/community', '/welcome', '/explore', '/my-trips', 
  '/chat', '/profile', '/create', '/settings', '/auth',
  '/favourites', '/approvals', '/feedback', '/install',
  '/onboarding', '/destinations', '/style', '/expenses'
];

// Check if current path should exist
const shouldExist = VALID_ROUTES.some(route => 
  location.pathname === route || location.pathname.startsWith(route + '/')
);

if (shouldExist) {
  // Auto-clear cache and reload
  useEffect(() => {
    toast("Fixing cached version...");
    clearCacheAndReload();
  }, []);
}
```

---

### Implementation Summary

| File | Change |
|------|--------|
| `vite.config.ts` | Add `skipWaiting: true` and `clientsClaim: true` |
| `src/pwa.ts` | Add immediate update check, auto-reload on update, export `clearCacheAndReload` |
| `src/pages/NotFound.tsx` | Detect known routes hitting 404, auto-clear cache |

---

### Expected Behavior After Fix

1. **New deployments**: Service worker activates immediately, users get new code without manual reload
2. **Stale cache 404**: If user somehow hits 404 on `/community`, page auto-detects this is a known route and clears cache
3. **Manual recovery**: "Reload App" button on 404 page now does full cache clear, not just `window.location.reload()`

---

### Technical Notes

- `skipWaiting: true` - Forces new SW to activate immediately (no waiting for tabs to close)
- `clientsClaim: true` - New SW takes control of all open pages immediately
- `immediate: true` in registerSW - Checks for updates on every page load
- Cache clearing targets both `caches` API and service worker registrations

