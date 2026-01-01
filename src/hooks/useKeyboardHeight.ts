import { useState, useEffect } from "react";

/**
 * Hook to detect mobile keyboard height using the Visual Viewport API.
 * Returns the keyboard height in pixels when the keyboard is open.
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Only run on client and if visualViewport is supported
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const viewport = window.visualViewport;

    const handleResize = () => {
      // Calculate keyboard height as the difference between window height and viewport height
      const heightDiff = window.innerHeight - viewport.height;
      
      // Only consider it a keyboard if the difference is significant (> 100px)
      // This avoids false positives from browser chrome changes
      const newKeyboardHeight = heightDiff > 100 ? heightDiff : 0;
      
      setKeyboardHeight(newKeyboardHeight);
    };

    // Initial check
    handleResize();

    // Listen for viewport resize (keyboard open/close)
    viewport.addEventListener("resize", handleResize);
    viewport.addEventListener("scroll", handleResize);

    return () => {
      viewport.removeEventListener("resize", handleResize);
      viewport.removeEventListener("scroll", handleResize);
    };
  }, []);

  return keyboardHeight;
}
