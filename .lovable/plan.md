

## Auto-scroll Caret Into View While Typing

### Problem
When typing long content in the Story Builder's TipTap editor, the caret disappears below the visible area. The scroll container (`<main data-scroll-container="app">` in AppLayout) doesn't follow the cursor, forcing "blind typing" -- especially painful on mobile with the keyboard open.

### Solution
Add a TipTap extension that listens for editor transactions (typing, Enter, etc.) and scrolls the AppLayout scroll container so the caret stays visible with comfortable bottom padding.

### Changes

**1. Create `src/lib/tiptapScrollIntoView.ts`** -- Custom TipTap Extension

A lightweight TipTap `Extension` that:
- Hooks into `onTransaction` (fires on every keystroke/content change)
- Gets the caret's DOM position via `view.coordsAtPos(selection.head)`
- Finds the nearest scroll container (`[data-scroll-container="app"]`)
- Compares caret bottom vs. container visible bottom minus a comfort padding (100px to account for sticky bottom bar + breathing room)
- If caret is below the threshold, smoothly scrolls the container
- Debounced at ~50ms using `requestAnimationFrame` to prevent jitter
- Also accounts for keyboard-open state: when `window.visualViewport.height` is smaller than `window.innerHeight`, uses viewport height as the effective bottom boundary

**2. Update `src/components/story-builder/RichTextEditor.tsx`**

- Import and add the new extension to the TipTap extensions array
- No other changes needed -- the extension self-manages scroll behavior

### Technical Detail

```text
Scroll container (AppLayout <main>)
+----------------------------------+
| Header (sticky, flex-none)       |
+----------------------------------+
| Cover image                      |
| Title                            |
| Toolbar (sticky top-0)           |
| Text block content...            |
| ...typing here...                |
| [CARET] <-- if below threshold   |
|          scroll container up     |
+------ visible bottom -----------+
| Bottom CTA bar (fixed)          |
| Bottom Nav (flex-none)           |
+----------------------------------+
```

The extension calculates:
- `caretBottom` = coords from TipTap's `view.coordsAtPos()`
- `visibleBottom` = scroll container's `getBoundingClientRect().bottom` minus padding (120px for bottom CTA + nav + comfort)
- If `caretBottom > visibleBottom`, scroll by the difference

Uses `requestAnimationFrame` + a dirty flag so multiple rapid keystrokes only trigger one scroll per frame.

### Why This Approach
- TipTap's built-in `scrollIntoView` only works when the editor itself is the scroll container. Here, the scroll container is the AppLayout `<main>`, so we need a custom solution targeting that element.
- Using `onTransaction` instead of DOM keydown events ensures it catches all content changes (paste, autocomplete, bullet creation, Enter key).
- The extension is self-contained and doesn't require any changes to StoryBuilder or AppLayout.

### Files
- **Create**: `src/lib/tiptapScrollIntoView.ts` (new extension, ~40 lines)
- **Edit**: `src/components/story-builder/RichTextEditor.tsx` (add extension import + registration, ~3 lines changed)

