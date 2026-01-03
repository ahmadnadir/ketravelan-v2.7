import { useEffect } from "react";

/**
 * usePreventRubberBand - Document-level iOS overscroll prevention
 * 
 * This hook prevents the viewport-level elastic "rubber band" effect on iOS,
 * especially in standalone PWA mode (Add to Home Screen). It works by:
 * 
 * 1. Detecting iOS devices and standalone mode
 * 2. Listening at document level (capture phase) for touch events
 * 3. Finding the active scrollable element under the touch
 * 4. Preventing default when user tries to scroll past boundaries
 * 
 * This is more robust than container-level listeners because iOS standalone
 * mode can trigger viewport-level overscroll that bypasses element listeners.
 */
export function usePreventRubberBand() {
  useEffect(() => {
    // Only apply on iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    
    if (!isIOS) return;

    // Check if running in standalone PWA mode (strongest enforcement)
    const isStandalone = 
      (window.navigator as any).standalone === true || 
      window.matchMedia("(display-mode: standalone)").matches;

    let startY = 0;
    let startX = 0;

    /**
     * Find the nearest scrollable ancestor from an element
     */
    const findScrollableAncestor = (element: Element | null): Element | null => {
      while (element && element !== document.documentElement) {
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        const isScrollable = overflowY === "auto" || overflowY === "scroll";
        const hasScrollableContent = element.scrollHeight > element.clientHeight;
        
        if (isScrollable && hasScrollableContent) {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Allow pinch-to-zoom
      if (e.touches.length > 1) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = currentY - startY;
      const deltaX = currentX - startX;

      // Only interfere with vertical scrolling (allow horizontal swipes)
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;

      // Find the scrollable element under the touch point
      const target = e.target as Element;
      const scrollable = findScrollableAncestor(target);

      if (!scrollable) {
        // No scrollable ancestor found - prevent all vertical overscroll
        // This handles the case where touch is on non-scrollable content
        if (isStandalone) {
          e.preventDefault();
        }
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Prevent overscroll at boundaries
      if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
        e.preventDefault();
      }
    };

    // Use capture phase and passive: false so we can preventDefault
    document.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart, { capture: true } as EventListenerOptions);
      document.removeEventListener("touchmove", handleTouchMove, { capture: true } as EventListenerOptions);
    };
  }, []);
}
