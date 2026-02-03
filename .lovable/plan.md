

# Story Builder Editor Fixes

## Overview
Fix the layout and interaction issues in the Story Builder to create a proper Substack-style editorial experience. The main issues are:
1. "Review & Publish" button overlaps with bottom navigation
2. Ensure contextual editing tools work correctly
3. Refine the editorial writing canvas layout

---

## Changes Summary

| Issue | Current State | Fix |
|-------|---------------|-----|
| CTA Overlap | Fixed at `bottom-0`, overlaps bottom nav | Position above bottom nav with `bottom-20` offset |
| Floating Toolbar | Works but needs refinement | Ensure proper z-index and positioning |
| Insert Menu | Uses Popover (appears on side) | Keep Popover but refine positioning |
| Writing Canvas | Already borderless | Add more line-height for better readability |

---

## Detailed Implementation

### 1. Fix "Review & Publish" Button Placement

**Current problem:** The CTA is positioned at `bottom-0` which causes it to overlap with the bottom navigation bar.

**Fix:** Position the CTA bar above the bottom navigation:

```tsx
// Before (line 303)
<div className="fixed bottom-0 left-0 right-0 ...">

// After
<div className="fixed bottom-20 left-0 right-0 ...">
```

The bottom nav height is approximately `h-16` (64px) plus safe area padding. Using `bottom-20` (80px) ensures the CTA floats above the nav with some breathing room.

**Additional improvements:**
- Add rounded corners to the floating CTA bar for a more refined look
- Remove the border-top since it's now floating
- Add subtle shadow for elevation

---

### 2. Verify Floating Toolbar (Already Working)

The floating toolbar already:
- Shows only on text selection
- Contains Bold, Bullet list, Numbered list, Link
- Uses horizontal layout
- Disappears when selection ends

No changes needed - already matches requirements.

---

### 3. Verify Inline "+" Insert Menu (Already Working)

The inline insert menu already:
- Shows on empty lines
- Displays subtle + button on left margin
- Opens with "Add Gallery" and "Add Social Links" options only

No changes needed - already matches requirements.

---

### 4. Enhance Writing Canvas

Minor refinements for editorial feel:
- Increase line-height from `leading-relaxed` to a custom larger value
- Ensure textarea has more generous spacing

---

## File to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Fix CTA positioning, refine styling |

---

## Technical Details

### Updated CTA Section

```tsx
{/* Bottom CTA - positioned above bottom nav */}
<div className="fixed bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl lg:max-w-4xl z-40">
  <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-4">
    <Button
      onClick={onComplete}
      disabled={!isValid}
      className="w-full gap-2"
      size="lg"
    >
      Review & Publish
      <ChevronRight className="h-4 w-4" />
    </Button>
    {!isValid && (
      <p className="text-xs text-muted-foreground text-center mt-2">
        Add a cover image and start writing
      </p>
    )}
  </div>
</div>
```

### Key positioning changes:
- `bottom-20`: Positions above the bottom nav (~80px from bottom)
- `left-4 right-4`: Full width with padding on mobile
- `sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl`: Centered with max-width on larger screens
- `rounded-xl shadow-lg`: Floating card appearance
- `z-40`: Below floating toolbar (z-50) but above content

### Writing Canvas Enhancement

```tsx
<textarea
  ref={textareaRef}
  value={draft.content}
  onChange={handleContentChange}
  placeholder="Start writing…"
  className="w-full min-h-[300px] bg-transparent border-none resize-none focus:outline-none text-lg text-foreground placeholder:text-muted-foreground/40"
  style={{ overflow: "hidden", lineHeight: "1.8" }}
/>
```

---

## Visual Result

```text
┌─────────────────────────────────────┐
│ ← Story Builder              ✕      │  ← Header
├─────────────────────────────────────┤
│                                     │
│  [Cover Image - Full Bleed]         │
│                                     │
│  Story Title                        │
│  Location (optional)                │
│                                     │
│  Start writing…                     │  ← Cursor auto-focused
│  │                                  │
│                                     │
│  [+ appears on empty line]          │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   [ Review & Publish → ]      │  │  ← Floating CTA card
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  🧭  💬  ➕  👥  👤                  │  ← Bottom nav (separate)
└─────────────────────────────────────┘
```

---

## Validation

The fix ensures:
- CTA is always visible and never overlaps bottom nav
- Writing area has adequate padding bottom to account for floating CTA
- Bottom navigation remains untouched and functional
- Keyboard opening doesn't cause overlap issues (CTA stays above nav)

