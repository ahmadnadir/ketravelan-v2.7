
## Story Builder UX Improvements

This plan improves the Story Builder page by fixing CTA alignment, enhancing the Text block writing experience, and ensuring responsive consistency.

---

### Current Issues

1. **CTA Misalignment**: The "Review & Publish" button uses `max-w-3xl` container while AppLayout uses `max-w-lg/xl/2xl/4xl` breakpoints - causing offset
2. **Text Block Cramped**: Textarea has no padding (`p-0`), feels constrained within card borders
3. **No Expand Capability**: Fixed 100px min-height with no growth
4. **No Formatting**: No bullet/numbered list support
5. **Dropdown Clutter**: "Free write / What happened?" selector adds friction

---

### Technical Changes

#### 1. Fix CTA Button Alignment

**File: `src/components/story-builder/StoryBuilder.tsx`**

The issue is the fixed CTA uses `max-w-3xl` but AppLayout uses different responsive breakpoints.

**Current (line 253-254):**
```tsx
<div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 ...">
  <div className="container max-w-3xl mx-auto">
```

**Change to:**
```tsx
<div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 px-4 sm:px-6 py-4 ...">
  <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
```

This matches the exact container classes from AppLayout (`max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl`) and consistent padding (`px-4 sm:px-6`).

---

#### 2. Redesign Text Block Component

**File: `src/components/story-builder/blocks/TextBlock.tsx`**

Complete rewrite with:

**A) Remove Dropdown**
- Delete the Select component entirely
- Use a simple placeholder for guidance

**B) Add Formatting Toolbar**
- Add minimal toolbar with bullet and numbered list buttons
- Position above textarea
- Uses Lucide icons: `List`, `ListOrdered`
- Click handlers insert list markers at cursor position

**C) Improved Textarea**
- **Auto-grow behavior**: Textarea expands as user types (up to max-height of 400px, then scrolls)
- **Better padding**: `px-4 py-3` for comfortable writing gutter
- **Cleaner styling**: Remove border-0 p-0, add subtle border and better spacing
- **Proper resize**: Allow vertical resize with `resize-y`

**Implementation:**

```tsx
import { useState, useRef, useEffect } from "react";
import { List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryBlock } from "@/data/communityMockData";

interface TextBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
}

export function TextBlock({ block, onUpdate }: TextBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + "px";
    }
  }, [block.content]);

  // Insert list marker at cursor
  const insertListMarker = (marker: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = block.content || "";
    
    // Find line start
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    
    // Insert marker at line start
    const newText = text.slice(0, lineStart) + marker + text.slice(lineStart);
    onUpdate({ content: newText });
    
    // Restore cursor position (after marker)
    setTimeout(() => {
      const newPos = start + marker.length;
      textarea.setSelectionRange(newPos, newPos + (end - start));
      textarea.focus();
    }, 0);
  };

  const handleBullet = () => insertListMarker("• ");
  const handleNumbered = () => {
    // Count existing numbered items to determine next number
    const lines = (block.content || "").split("\n");
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorLine = (block.content || "")
      .slice(0, textarea.selectionStart)
      .split("\n").length - 1;
    
    // Find last numbered item before cursor
    let lastNum = 0;
    for (let i = cursorLine; i >= 0; i--) {
      const match = lines[i].match(/^(\d+)\. /);
      if (match) {
        lastNum = parseInt(match[1]);
        break;
      }
    }
    
    insertListMarker(`${lastNum + 1}. `);
  };

  return (
    <div className="space-y-2">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBullet}
          className="h-8 w-8 p-0"
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNumbered}
          className="h-8 w-8 p-0"
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea with auto-grow */}
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Write your story..."
        className="w-full min-h-[120px] max-h-[400px] px-4 py-3 text-base 
                   bg-muted/30 rounded-lg border border-border/50
                   placeholder:text-muted-foreground
                   focus:outline-none focus:border-primary/50 focus:bg-background
                   resize-y transition-colors"
      />
      
      {/* Optional hint */}
      <p className="text-xs text-muted-foreground">
        Tip: Type "• " or "1. " to start a list
      </p>
    </div>
  );
}
```

---

#### 3. Update Block Container Padding

**File: `src/components/story-builder/StoryBuilder.tsx`**

Current block content padding (line 223):
```tsx
<div className="p-3">
```

Change to more spacious padding for text blocks:
```tsx
<div className="p-4">
```

This gives more breathing room between the block header and content.

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Fix CTA container to match AppLayout breakpoints; increase block content padding |
| `src/components/story-builder/blocks/TextBlock.tsx` | Remove dropdown; add formatting toolbar; implement auto-grow textarea; improve styling |

---

### Visual Changes Summary

| Before | After |
|--------|-------|
| CTA uses `max-w-3xl` (misaligned) | CTA uses same breakpoints as AppLayout |
| Textarea has no padding (`p-0`) | Textarea has `px-4 py-3` comfortable gutter |
| Fixed 100px min-height | Auto-grows up to 400px, then scrolls |
| No formatting options | Bullet + numbered list toolbar buttons |
| Dropdown selector for prompts | Clean, direct writing experience |

---

### Acceptance Criteria

- CTA button edges align with Story Builder content cards at all screen sizes
- No visual shift between steps or screen sizes
- CTA never overlaps bottom navbar (64px + safe area offset maintained)
- Text block feels spacious with proper padding
- Textarea auto-grows as user types (up to 400px max)
- Bullet and numbered list buttons work correctly
- No dropdown visible in Text block
- Keyboard hint shown for list shortcuts
