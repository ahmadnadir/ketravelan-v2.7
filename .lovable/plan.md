
# Sticky Editing Toolbar for Long Stories

## Overview
Make the editing toolbar remain fixed at the top of the content area when users scroll through long stories. This ensures formatting tools are always accessible without scrolling back up.

---

## Current Issue

When writing a long story, the editing toolbar scrolls away with the content, requiring users to scroll back up to access formatting tools.

---

## Solution

Make the `EditingToolbar` sticky so it stays visible at the top of the scrollable content area while the user writes.

---

## Implementation

### StoryBuilder.tsx Changes

**Current structure (lines 189-195):**
```tsx
{/* Persistent Editing Toolbar */}
<EditingToolbar
  textareaRef={textareaRef}
  onFormat={handleFormat}
  onAddGallery={handleAddGallery}
  onOpenSocialSheet={() => setShowSocialSheet(true)}
/>
```

**Updated structure:**
```tsx
{/* Sticky Editing Toolbar - stays at top when scrolling */}
<div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/95 backdrop-blur-sm">
  <EditingToolbar
    textareaRef={textareaRef}
    onFormat={handleFormat}
    onAddGallery={handleAddGallery}
    onOpenSocialSheet={() => setShowSocialSheet(true)}
  />
</div>
```

**Key changes:**
- Wrap toolbar in a `sticky top-0` container
- Use `z-20` to ensure it stays above content
- Apply negative margins (`-mx-4 sm:-mx-6`) to extend full width
- Add matching padding (`px-4 sm:px-6`) for content alignment
- Use `bg-background/95 backdrop-blur-sm` for a subtle frosted glass effect when content scrolls behind

---

## Visual Result

```text
┌─────────────────────────────────────┐
│ ← Story Builder              ✕      │  ← Page header (already sticky)
├─────────────────────────────────────┤
│  [B] [U] [•] [1.] [📷] [@]         │  ← Toolbar (NOW STICKY)
│  ─────────────────────────────────  │
├─────────────────────────────────────┤
│                                     │
│  Long story content scrolls here... │  ← Content scrolls
│  ...                                │
│  ...                                │
│  ...                                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   [ Review & Publish → ]      │  │  ← Fixed CTA
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  🧭  💬  ➕  👥  👤                  │
└─────────────────────────────────────┘
```

When user scrolls down:
- Cover image scrolls away
- Title/location scrolls away
- Toolbar stays pinned at top
- Writing area scrolls underneath the toolbar

---

## File to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Wrap EditingToolbar in sticky container |

---

## Technical Notes

- The `sticky top-0` works because the content area inside AppLayout is scrollable
- `z-20` ensures toolbar stays above the textarea and other content
- The backdrop blur creates a subtle visual separation when content scrolls behind
- This matches the sticky header pattern already used in the CreateStory page header
