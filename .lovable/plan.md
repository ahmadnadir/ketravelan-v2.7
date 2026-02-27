

## Upgrade Story Builder to WYSIWYG Rich Text Editor

### Problem
The Story Builder uses a plain `<textarea>` and inserts raw markdown syntax (`**text**`, `__text__`) when formatting buttons are clicked. Users see the raw symbols instead of visually formatted text.

### Solution
Replace the `<textarea>` with **TipTap** -- a headless, extensible rich text editor built on ProseMirror. It's the best fit because:
- Lightweight and tree-shakeable (only import what you need)
- Works seamlessly with React
- Built-in extensions for bold, underline, bullet list, ordered list
- Outputs HTML that can be stored and rendered safely
- Supports keyboard shortcuts (Ctrl+B, Ctrl+U) out of the box
- No heavy UI opinions -- we style it ourselves to match the editorial feel

### Changes Overview

**1. Install TipTap packages**

Add these dependencies:
- `@tiptap/react` -- React bindings
- `@tiptap/starter-kit` -- Bold, italic, lists, headings, etc.
- `@tiptap/extension-underline` -- Underline support (not in starter-kit)
- `@tiptap/extension-placeholder` -- Placeholder text support

**2. Create new `RichTextEditor` component**

New file: `src/components/story-builder/RichTextEditor.tsx`

- Uses `useEditor` hook with StarterKit + Underline + Placeholder extensions
- Renders via TipTap's `<EditorContent>` component
- Styled to match the current borderless, editorial textarea look (transparent background, no border, 1.8 line-height, text-lg)
- Auto-grows with content (no fixed height)
- Exposes the editor instance to the toolbar

**3. Update `EditingToolbar`**

Modify: `src/components/story-builder/EditingToolbar.tsx`

- Change props: replace `textareaRef` + `onFormat` with a TipTap `Editor` instance
- Bold button calls `editor.chain().focus().toggleBold().run()`
- Underline button calls `editor.chain().focus().toggleUnderline().run()`
- Bullet list calls `editor.chain().focus().toggleBulletList().run()`
- Ordered list calls `editor.chain().focus().toggleOrderedList().run()`
- Add active state highlighting: when cursor is inside bold text, the Bold button gets `text-foreground bg-accent` styling
- Gallery and social link buttons stay unchanged

**4. Update `StoryBuilder`**

Modify: `src/components/story-builder/StoryBuilder.tsx`

- Replace `<textarea>` with the new `<RichTextEditor>` component
- Remove all markdown formatting logic (`handleFormat`, `handleKeyDown` for bullet/number continuation)
- Store content as HTML string instead of plain text (the `content` field in `StoryDraft` remains a string -- just holds HTML now)
- Pass editor instance to `EditingToolbar`
- Remove the second "continuation" textarea after media -- use a single editor
- The `contentAfterMedia` field will be deprecated (content after images lives in the same editor)

**5. Update content rendering in read views**

Modify: `src/pages/StoryDetail.tsx`

- Render `story.content` using `dangerouslySetInnerHTML` with proper sanitization styling
- Add TipTap prose classes for consistent rendering (bold renders as bold, underline as underline, lists as lists)

Modify: `src/components/story-builder/PublishStep.tsx`

- Same approach for preview card -- render HTML content instead of plain text

Modify: `src/contexts/CommunityContext.tsx`

- Update excerpt extraction: strip HTML tags before slicing for excerpt generation
- Update word count / reading time calculation: strip HTML before counting

**6. Add editor styles**

Modify: `src/index.css`

Add TipTap editor styles:
- `.tiptap` base styles matching the editorial feel
- Placeholder styling (muted foreground, disappears on input)
- List styles (bullet and numbered)
- Focus outline removal for seamless look

### Data Migration Note

Existing drafts stored in localStorage have plain-text content. The RichTextEditor will render plain text as-is (TipTap handles plain text gracefully as paragraph content), so no explicit migration is needed. New formatting will be stored as HTML going forward.

### What Stays the Same
- Cover image upload and display
- Inline media (images/galleries) insertion and management
- Social links functionality
- Save as Draft / Preview flow
- Draft persistence in localStorage
- Overall page layout and editorial feel

### Technical Details

**TipTap editor configuration:**
```text
useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
      orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
    }),
    Underline,
    Placeholder.configure({ placeholder: 'Write your experience here' }),
  ],
  content: draft.content,  // HTML string
  onUpdate: ({ editor }) => saveDraft({ content: editor.getHTML() }),
  editorProps: {
    attributes: {
      class: 'min-h-[60px] focus:outline-none text-lg leading-[1.8]',
    },
  },
})
```

**Files created:** 1
- `src/components/story-builder/RichTextEditor.tsx`

**Files modified:** 5
- `src/components/story-builder/EditingToolbar.tsx`
- `src/components/story-builder/StoryBuilder.tsx`
- `src/components/story-builder/PublishStep.tsx`
- `src/pages/StoryDetail.tsx`
- `src/index.css`

**Files with minor updates:** 1
- `src/contexts/CommunityContext.tsx` (strip HTML for excerpts/word count)

