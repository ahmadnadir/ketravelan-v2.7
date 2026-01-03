import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exclude direct chat pages from scroll-to-top behavior
    if (pathname.startsWith("/chat/")) {
      return;
    }
    
    // Target the app's scroll container instead of window
    const scrollContainer = document.querySelector('[data-scroll-container="app"]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0 });
    } else {
      // Fallback for pages not using AppLayout/FocusedFlowLayout
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
