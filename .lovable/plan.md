

# Story Builder Redesign: Rich Text Editor

## Overview

Transform the Story Builder from a structured block-based editor into a fluid, writing-first experience that feels like a modern notes app (similar to Apple Notes or Medium).

---

## Changes Summary

| Area | Current | New |
|------|---------|-----|
| Editor | Block-based with cards (Text, Image, Location, etc.) | Single continuous rich-text area |
| Toolbar | "Add Block" bottom sheet | Inline floating toolbar + bottom action bar |
| Media | Separate Image blocks | Inline photos/galleries within text flow |
| Social Links | Block type with manual URL entry | Select from linked profile accounts |
| Draft Banner | System-style warning | Warm, encouraging tone |

---

## Detailed Implementation

### 1. Replace Block Editor with Unified Rich Text Area

**Remove:**
- `AddBlockSheet.tsx` component
- Block rendering logic with drag handles
- Individual block components: `TextBlock`, `LocationBlock` (keep `ImageBlock` logic for reference)
- "Add First Block" empty state CTA

**Add:**
- Single auto-growing textarea/contenteditable area
- Auto-focus on mount
- Placeholder: "Start writing your story..."
- Support for:
  - Paragraph text (default)
  - Bullet lists (prefix `• ` or `- `)
  - Numbered lists (prefix `1. `)
  - Inline links (via toolbar)

**Technical approach:**
```tsx
// New state in StoryBuilder
const [content, setContent] = useState<string>(draft.content || "");
const editorRef = useRef<HTMLTextAreaElement>(null);

// Auto-focus on mount
useEffect(() => {
  editorRef.current?.focus();
}, []);
```

Update `StoryDraft` interface to include a single `content: string` field for the rich text body (blocks array becomes legacy/migration only).

---

### 2. Inline Floating Toolbar (Text Selection)

**Trigger:** Show when user selects text (highlights)

**Actions:**
| Icon | Action |
|------|--------|
| **B** | Bold (wrap in `**text**`) |
| List | Bullet list (prefix lines with `• `) |
| ListOrdered | Numbered list |
| Link2 | Insert inline link |

**Implementation:**
- Use `document.getSelection()` to detect selection
- Position toolbar above selection using `getBoundingClientRect()`
- Apply Markdown-style formatting (for simplicity, no WYSIWYG)

```tsx
// FloatingToolbar component
interface FloatingToolbarProps {
  selection: Selection | null;
  onFormat: (type: "bold" | "bullet" | "numbered" | "link") => void;
}
```

---

### 3. Bottom Action Bar (Always Visible)

Fixed bottom bar with icon-only actions:

| Icon | Label | Action |
|------|-------|--------|
| Image | Add Photo | Opens image picker, inserts inline |
| Images | Add Gallery | Opens multi-image picker |
| AtSign | Social Link | Opens profile social selector sheet |
| MoreHorizontal | More | Future expansion |

**Behavior:**
- Sits above the keyboard on mobile
- Icons only (no labels) for minimal footprint
- Each action inserts content at cursor position

---

### 4. Inline Media Insertion

**Single Photo:**
```
[After selecting image]
↓ Inserted into content flow

┌──────────────────────────────┐
│       [Full-width image]     │
│                              │
└──────────────────────────────┘
  📝 Add caption (tap to expand)
```

- Full-width display
- Caption collapsed by default
- Caption revealed on tap/focus

**Gallery:**
- Horizontal swipeable carousel
- Each image has optional caption
- Treated as single unit in flow

**Data structure:**
```ts
interface InlineMedia {
  id: string;
  type: "image" | "gallery";
  images: { url: string; caption?: string }[];
  position: number; // cursor position in content
}
```

---

### 5. Social Media Link Insertion (Profile-Aware)

**Flow:**
1. User taps "Add Social Link" in bottom bar
2. Opens bottom sheet showing ONLY platforms already linked in user profile
3. User selects one or more (checkbox)
4. Inserts compact inline card

**Mock user profile social links:**
```ts
const userSocialLinks = [
  { platform: "instagram", handle: "@ahmadrazak" },
  { platform: "youtube", handle: "@ahmadtravels" },
];
```

**Inserted card appearance:**
```
┌─────────────────────────┐
│ 📷 @ahmadrazak          │
│ 📺 @ahmadtravels        │
└─────────────────────────┘
```

**No manual typing required** - pulls from profile.

---

### 6. Improved Draft Banner

**Before (current):**
> "You have an unfinished story"
> Last saved 2 hours ago
> [Continue Editing] [Start Fresh]

**After:**
> "You were writing a story recently. Want to continue?"
> Last saved 2 hours ago
> [Continue writing] [Start fresh]

**Styling changes:**
- Softer background (muted/warm)
- Friendly icon (Pencil or edit icon instead of FileText)
- Primary action: "Continue writing"
- Secondary action: "Start fresh"

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `src/components/story-builder/StoryBuilder.tsx` | Complete rewrite |
| `src/components/story-builder/AddBlockSheet.tsx` | **Delete** |
| `src/components/story-builder/blocks/TextBlock.tsx` | **Delete** |
| `src/components/story-builder/blocks/LocationBlock.tsx` | **Delete** |
| `src/components/story-builder/blocks/SocialLinkBlock.tsx` | **Delete** |
| `src/components/story-builder/DraftBanner.tsx` | Update copy/styling |
| `src/components/story-builder/FloatingToolbar.tsx` | **Create** |
| `src/components/story-builder/BottomActionBar.tsx` | **Create** |
| `src/components/story-builder/SocialLinkSheet.tsx` | **Create** |
| `src/components/story-builder/InlineImage.tsx` | **Create** |
| `src/components/story-builder/InlineGallery.tsx` | **Create** |
| `src/hooks/useStoryDraft.ts` | Add `content` field, migrate from blocks |
| `src/data/communityMockData.ts` | Keep BlockType for legacy support |

---

## Technical Details

### Updated StoryDraft Interface

```ts
export interface StoryDraft {
  // ... existing fields
  content: string;              // NEW: rich text body
  inlineMedia: InlineMedia[];   // NEW: positioned images/galleries
  // blocks: StoryBlock[];      // Keep for migration only
}

interface InlineMedia {
  id: string;
  type: "image" | "gallery";
  images: { url: string; caption?: string }[];
  insertPosition: number; // character index in content
}
```

### Validation Logic Update

```ts
// Before: draft.coverImage && draft.blocks.length > 0
// After:
const isValid = draft.coverImage && draft.content.trim().length > 0;
```

### New Components Structure

```
src/components/story-builder/
├── StoryBuilder.tsx          # Main editor container
├── RichTextEditor.tsx        # The actual textarea with formatting
├── FloatingToolbar.tsx       # Selection-based formatting
├── BottomActionBar.tsx       # Photo/Gallery/Social actions
├── SocialLinkSheet.tsx       # Profile-aware social picker
├── InlineImage.tsx           # Single image with caption
├── InlineGallery.tsx         # Swipeable gallery carousel
├── DraftBanner.tsx           # Updated encouraging copy
├── PublishStep.tsx           # Unchanged
└── StorySetupStep.tsx        # Unchanged
```

---

## Migration Strategy

1. Keep `blocks` array in `StoryDraft` for backwards compatibility
2. On load, if `blocks` exist but `content` is empty, migrate:
   - Concatenate text block content into `content`
   - Convert image blocks to `inlineMedia`
3. New stories only use `content` + `inlineMedia`

---

## UX Principles Applied

- Writing-first, formatting-second
- Progressive disclosure (tools appear when needed)
- All enhancements optional
- No forced structure
- Mobile-first typing comfort
- Minimal visual noise

