

# Story Builder Writing Experience Polish

## Overview
Improve the Story Builder's writing experience by updating the placeholder text and refining the CTA button styling to match the visual language of the Story Setup step while making the button feel more intentional and premium.

---

## Changes Summary

| Element | Current | After |
|---------|---------|-------|
| Placeholder text | "Start writing…" | "Write your experience here" |
| CTA button | Full-width inside container | Centered, auto-width button |
| CTA container | `rounded-xl` with `p-4` | Refined styling with centered content |

---

## Implementation Details

### 1. Update Writing Area Placeholder

Change the placeholder text in the textarea from "Start writing…" to "Write your experience here":

```tsx
// Line 203 in StoryBuilder.tsx
placeholder="Write your experience here"
```

The placeholder styling is already correct:
- Light grey color (`placeholder:text-muted-foreground/40`)
- Visible only when empty (native HTML behavior)
- Disappears on first keystroke
- Reappears when content is cleared

---

### 2. Update CTA Button Styling

**Current structure (lines 239-257):**
```tsx
<div className="fixed bottom-20 left-4 right-4 ...">
  <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border p-4">
    <Button className="w-full gap-2" size="lg">
      Review & Publish
    </Button>
  </div>
</div>
```

**Updated structure:**
```tsx
<div className="fixed bottom-20 left-4 right-4 ...">
  <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border p-4 flex flex-col items-center">
    <Button className="px-8 gap-2" size="lg">
      Review & Publish
    </Button>
    {/* Validation message centered below */}
  </div>
</div>
```

**Key changes:**
- Add `flex flex-col items-center` to container for centering
- Remove `w-full` from button (make it auto-width)
- Add `px-8` for comfortable horizontal padding on button
- Keep validation text centered with `text-center`

---

### 3. Visual Result

```text
┌─────────────────────────────────────┐
│ ← Story Builder              ✕      │
├─────────────────────────────────────┤
│                                     │
│  [Cover Image]                      │
│                                     │
│  Story Title                        │
│  Location                           │
│                                     │
│  [B] [U] [•] [1.] [📷] [@]         │  ← Toolbar
│  ─────────────────────────────────  │
│                                     │
│  Write your experience here         │  ← Updated placeholder
│  │                                  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │    [ Review & Publish → ]     │  │  ← Centered button
│  │   Add a cover image and...    │  │
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  🧭  💬  ➕  👥  👤                  │
└─────────────────────────────────────┘
```

---

## File to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Update placeholder, refine CTA styling |

---

## Technical Changes

### StoryBuilder.tsx Changes

**Line 203 - Placeholder update:**
```tsx
placeholder="Write your experience here"
```

**Lines 239-257 - CTA container update:**
```tsx
{/* Bottom CTA - positioned above bottom nav */}
<div className="fixed bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl z-40">
  <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-4 flex flex-col items-center gap-2">
    <Button
      onClick={onComplete}
      disabled={!isValid}
      className="px-8 gap-2"
      size="lg"
    >
      Review & Publish
      <ChevronRight className="h-4 w-4" />
    </Button>
    {!isValid && (
      <p className="text-xs text-muted-foreground text-center">
        Add a cover image and start writing
      </p>
    )}
  </div>
</div>
```

---

## Success Criteria Alignment

| Requirement | Implementation |
|-------------|----------------|
| Placeholder "Write your experience here" | Updated in textarea |
| Light grey, visible when empty | Already using `placeholder:text-muted-foreground/40` |
| Floating container with rounded corners | Already has `rounded-xl` |
| Light background with subtle shadow | Already has `bg-background/95` and `shadow-lg` |
| Button centered, not full-width | Changed to `px-8` without `w-full`, container uses `flex items-center` |
| Container inset from edges | Already has `left-4 right-4` |
| Button disabled until valid | Already checks `!isValid` (cover image + content) |
| Never overlaps bottom nav | Already positioned at `bottom-20` |

