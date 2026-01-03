import { useCallback, useEffect, useRef } from "react";
import { useKeyboardHeight } from "./useKeyboardHeight";

/**
 * Hook to make inputs keyboard-aware on iOS.
 * Automatically scrolls input into view when keyboard opens.
 * Returns a ref and focus handler to attach to inputs/textareas.
 */
export function useKeyboardAwareInput<T extends HTMLElement = HTMLElement>() {
  const keyboardHeight = useKeyboardHeight();
  const elementRef = useRef<T>(null);
  const lastKeyboardHeight = useRef(0);

  // When keyboard height changes (opens), scroll element into view
  useEffect(() => {
    if (keyboardHeight > 0 && lastKeyboardHeight.current === 0) {
      // Keyboard just opened
      if (elementRef.current && document.activeElement === elementRef.current) {
        // Small delay to let keyboard animation settle
        setTimeout(() => {
          elementRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
    lastKeyboardHeight.current = keyboardHeight;
  }, [keyboardHeight]);

  // Focus handler that scrolls element into view
  const handleFocus = useCallback(() => {
    // Delay to allow keyboard to start opening
    setTimeout(() => {
      elementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }, []);

  return {
    ref: elementRef,
    onFocus: handleFocus,
    keyboardHeight,
  };
}

/**
 * Simpler utility function to scroll any element into view on focus.
 * Use this for inputs that don't need the full hook.
 */
export function scrollInputIntoView(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 300);
}
