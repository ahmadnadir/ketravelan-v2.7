import { Extension } from "@tiptap/core";

/**
 * TipTap extension that auto-scrolls the AppLayout scroll container
 * to keep the caret visible while typing.
 */
export const ScrollIntoView = Extension.create({
  name: "scrollIntoView",

  onTransaction({ transaction }) {
    if (!transaction.docChanged && !transaction.steps.length) return;

    requestAnimationFrame(() => {
      const { view } = this.editor;
      if (!view.hasFocus()) return;

      const head = view.state.selection.head;
      let coords: { bottom: number };
      try {
        coords = view.coordsAtPos(head);
      } catch {
        return;
      }

      const scrollContainer = document.querySelector<HTMLElement>(
        '[data-scroll-container="app"]'
      );
      if (!scrollContainer) return;

      // Account for keyboard on mobile
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const containerRect = scrollContainer.getBoundingClientRect();

      // Effective visible bottom = min of container bottom and viewport height,
      // minus padding for bottom CTA bar + nav + comfort
      const padding = 120;
      const visibleBottom = Math.min(containerRect.bottom, viewportHeight) - padding;

      if (coords.bottom > visibleBottom) {
        scrollContainer.scrollBy({
          top: coords.bottom - visibleBottom,
          behavior: "smooth",
        });
      }
    });
  },
});
