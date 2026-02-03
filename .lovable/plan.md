

# Persistent Editing Toolbar for Story Builder

## Overview
Replace all floating and contextual editing tools with a single, always-visible horizontal toolbar positioned directly below the story title. This makes editing tools immediately discoverable for non-technical users.

---

## Changes Summary

| Component | Current State | New State |
|-----------|---------------|-----------|
| Floating Toolbar | Shows on text selection | **Remove** |
| Inline "+" Insert Menu | Shows on empty lines | **Remove** |
| Persistent Toolbar | Does not exist | **Add below title** |
| Gallery insertion | Via inline + button | Via persistent toolbar (removed) |
| Social link insertion | Via inline + button | Via persistent toolbar |

---

## Detailed Implementation

### 1. Remove Floating Toolbar

Delete the `FloatingToolbar` component usage from `StoryBuilder.tsx`. The floating behavior is being replaced with an always-visible toolbar.

### 2. Remove Inline "+" Insert Menu  

Delete the `InlineInsertMenu` component usage from `StoryBuilder.tsx`. All contextual insert logic (empty line detection, positioning) will also be removed.

### 3. Add Persistent Toolbar Below Title

Create a new `EditingToolbar.tsx` component that renders a horizontal toolbar with:

| Icon | Tool | Behavior |
|------|------|----------|
| Bold | Bold text | Wraps selected text in `**bold**` |
| Underline | Underline | Wraps selected text in `__underline__` |
| List | Bullet list | Prefixes lines with `• ` |
| ListOrdered | Numbered list | Prefixes lines with `1. ` |
| AtSign | Social Media Link | Opens bottom sheet to select profiles |

**Position**: Rendered immediately after the title/location header, before the writing canvas.

**Styling**:
- Full-width with subtle border-bottom
- Icon buttons with muted colors
- No background fill (minimal, editorial feel)
- Horizontal layout with even spacing

### 4. Gallery Insertion Removed from Toolbar

Per requirements, the toolbar includes only: Bold, Underline, Bullet list, Numbered list, Social Media Link.

Gallery/image insertion is not included in the specified tools. The existing inline media rendering will remain for stories that already have images, but no new insertion mechanism is being added in this toolbar.

### 5. Social Media Link Behavior

When user taps the Social Media Link icon:
1. Opens the existing `SocialLinkSheet` (bottom sheet)
2. Shows only platforms already linked in user profile (Instagram, YouTube, TikTok, etc.)
3. Allows multi-selection
4. Inserts as plain inline text (already working via `SocialLinksInline`)

The insertion appears as:
```
You can find me on:
Instagram · @username
Threads · @username
```

No cards, no icons, no borders (already implemented correctly).

### 6. Clean Up Event Listeners

Remove:
- Empty line detection (`checkForEmptyLine`)
- Event listeners for cursor position tracking
- `showInsertMenu` and `insertMenuPosition` state

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `src/components/story-builder/EditingToolbar.tsx` | **Create** - New persistent toolbar |
| `src/components/story-builder/StoryBuilder.tsx` | **Modify** - Remove floating/inline tools, add persistent toolbar |
| `src/components/story-builder/FloatingToolbar.tsx` | **Keep** - Repurpose as formatting logic source, but don't render |
| `src/components/story-builder/InlineInsertMenu.tsx` | **Delete** - No longer needed |

---

## Technical Details

### New EditingToolbar Component

```tsx
// src/components/story-builder/EditingToolbar.tsx
interface EditingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onFormat: (type: FormatType) => void;
  onOpenSocialSheet: () => void;
}

// Renders: Bold | Underline | Bullet | Numbered | Social Link
// Always visible, horizontal layout
```

### Updated StoryBuilder Structure

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
│  [B] [U] [•] [1.] [@]              │  ← Persistent toolbar
│  ─────────────────────────────────  │
│                                     │
│  Start writing…                     │  ← Writing canvas
│  │                                  │
│                                     │
│  Follow my journey:                 │  ← Social links (if added)
│  Instagram · @username              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   [ Review & Publish → ]      │  │  ← Floating CTA
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  🧭  💬  ➕  👥  👤                  │  ← Bottom nav
└─────────────────────────────────────┘
```

### Format Type Update

Add "underline" to the `FormatType`:

```tsx
export type FormatType = "bold" | "underline" | "bullet" | "numbered" | "link";
```

### handleFormat Update

Add underline formatting logic:

```tsx
case "underline":
  newText = `${beforeText}__${selectedText}__${afterText}`;
  newCursorPos = end + 4;
  break;
```

---

## State Cleanup

**Remove from StoryBuilder**:
```tsx
// Remove these
const [showInsertMenu, setShowInsertMenu] = useState(false);
const [insertMenuPosition, setInsertMenuPosition] = useState({ top: 0 });
const checkForEmptyLine = useCallback(() => { ... });
// Remove event listeners for checkForEmptyLine
```

**Keep**:
```tsx
const [showSocialSheet, setShowSocialSheet] = useState(false);
// All formatting and social link logic
```

---

## What Remains Unchanged

- Cover image upload
- Title/location display
- Writing canvas (borderless, full-width, auto-focus)
- Line height and spacing (1.8)
- "Review & Publish" CTA positioning (bottom-20)
- Social link bottom sheet behavior
- Social links inline display format
- Inline media rendering (for existing images/galleries)

---

## Success Criteria Alignment

| Requirement | Implementation |
|-------------|----------------|
| Toolbar always visible | Persistent toolbar below title |
| Toolbar immediately below title | Positioned right after header |
| No floating toolbars | FloatingToolbar removed |
| No bottom editing bars | Only CTA at bottom |
| No inline + buttons | InlineInsertMenu removed |
| Social link opens sheet | Same behavior |
| Plain inline text insertion | SocialLinksInline unchanged |
| Writing canvas borderless | Already implemented |
| Generous line height | Already 1.8 |
| Cursor auto-focus | Already implemented |

