import { useEffect, RefObject } from "react";

/**
 * usePreventRubberBand - Prevents iOS Safari/Chrome elastic overscroll (rubber-band effect)
 * 
 * This hook attaches touch handlers that detect when the user is trying to scroll
 * past the edges of a scroll container and prevents the default browser behavior
 * that causes the entire viewport to "bounce", which can drag fixed elements like navbars.
 * 
 * Only activates on iOS devices (iPhone, iPad, iPod).
 */
export function usePreventRubberBand(scrollContainerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    // Only apply on iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    
    if (!isIOS) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Pulling down at top or pushing up at bottom = prevent rubber band
      if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
        e.preventDefault();
      }
    };

    const container = scrollContainerRef.current;
    if (!container) return;

    // Use passive: false so we can call preventDefault
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollContainerRef]);
}
