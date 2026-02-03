
# Standardize Story Builder CTA Button

## Overview
Update the Story Builder's primary action button to match the Story Setup CTA style, ensuring visual and behavioral consistency across the Create flow.

---

## Current Issues

| Issue | Story Setup | Story Builder |
|-------|-------------|---------------|
| Button Label | "Continue to Story Builder" | "Review & Publish" (incorrect) |
| Disabled State | Grayed out when invalid | Grayed out when invalid |
| Helper Text | None | "Add a cover image and start writing" |
| User Perception | Progressive step | Final action |

---

## Required Changes

### 1. Update Button Label
Change from "Review & Publish" to "Continue to Review" to indicate this is a progressive step, not a final action.

### 2. Remove Disabled State
Remove the `disabled={!isValid}` prop so the button always appears actionable. Handle validation on click instead.

### 3. Add Click Validation with Toast
When button is clicked without required fields:
- Show a toast notification: "Please add a cover image and start writing to continue"
- Optionally scroll to the missing field (cover image area)

### 4. Update Helper Text
Replace "Add a cover image and start writing" with "You can edit and publish later" to reduce commitment anxiety.

---

## Implementation Details

### File: `src/components/story-builder/StoryBuilder.tsx`

**Changes to the Button:**

```tsx
// Before:
<Button
  onClick={onComplete}
  disabled={!isValid}
  className="w-full gap-2"
  size="lg"
>
  Review & Publish
  <ChevronRight className="h-4 w-4" />
</Button>

// After:
<Button
  onClick={handleContinueClick}
  className="w-full gap-2"
  size="lg"
>
  Continue to Review
  <ChevronRight className="h-4 w-4" />
</Button>
```

**Add validation handler:**

```tsx
import { toast } from "sonner";

const handleContinueClick = () => {
  if (!draft.coverImage) {
    toast.error("Please add a cover image to continue");
    coverInputRef.current?.click();
    return;
  }
  if (!draft.content.trim()) {
    toast.error("Please write something about your experience");
    textareaRef.current?.focus();
    return;
  }
  onComplete();
};
```

**Update helper text:**

```tsx
// Before:
{!isValid && (
  <p className="text-xs text-muted-foreground text-center">
    Add a cover image and start writing
  </p>
)}

// After:
<p className="text-xs text-muted-foreground text-center">
  You can edit and publish later
</p>
```

---

## Visual Result

Before:
- Grey, disabled-looking button saying "Review & Publish"
- Helper text implies blocking requirement

After:
- Dark, actionable button saying "Continue to Review"
- Encouraging helper text that reduces anxiety
- Validation happens on click with friendly toast messages

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Update button label, remove disabled state, add click validation with toast, update helper text |

---

## UX Flow After Changes

```text
Setup                  Write                  Review & Publish
[Continue to ──────>  [Continue to ──────>   [Publish Story]
 Story Builder]        Review]
   (dark)                (dark)                  (dark)
```

All CTAs now use consistent dark styling with progressive language.
