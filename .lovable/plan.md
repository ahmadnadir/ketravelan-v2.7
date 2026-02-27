
I’ll fix this by moving Story Builder to a true ordered content-block model so insertion happens by block index (cursor context), not by appending to a separate media list.

## What I found (root cause)
- The builder currently stores text (`draft.content`) separately from media (`draft.inlineMedia`).
- Adding media always appends: `inlineMedia: [...draft.inlineMedia, media]`.
- `insertPosition` is recorded but not actually used to render or insert at cursor position.
- Because text/media are split across different structures, adding a new image can visually “reflow” where text appears, causing unstable ordering.

## Implementation approach
### 1) Introduce a single ordered Story Builder block model
Create a new draft-level array (e.g. `editorBlocks`) as the source of truth for builder order:
- `text` block (HTML content for TipTap)
- `image` block
- `gallery` block
- (future-ready for location/social blocks)

Example:
```text
[
  { id: "b1", type: "text", content: "<p>...</p>" },
  { id: "b2", type: "image", images: [...] },
  { id: "b3", type: "text", content: "<p>...</p>" }
]
```

### 2) Cursor/index-aware insertion logic
When “Add Image/Gallery” is used:
- Read active block id/index from focused editor/media block.
- Insert new media block directly after active block index.
- If needed, ensure there is a following text block so user can continue typing immediately.
- Do not rebuild the whole document; update only affected block slice with immutable array insert.

This satisfies:
- no append-only behavior
- no automatic block re-grouping
- stable order across repeated insertions

### 3) Refactor StoryBuilder rendering to interleaved blocks
Update `StoryBuilder.tsx` to render `editorBlocks` in order:
- `text` block -> `RichTextEditor`
- `image` block -> `InlineImage`
- `gallery` block -> `InlineGallery`

Track `activeBlockId` on focus/click to anchor insertion location.  
Remove dependence on “content after media” behavior for layout stability.

### 4) Update draft hook APIs for block operations
In `useStoryDrafts.ts`:
- Add block operations:
  - `insertEditorBlock(afterBlockId, block)`
  - `updateEditorBlock(blockId, updates)`
  - `removeEditorBlock(blockId)`
  - `setActiveEditorBlock(blockId)` (if stored centrally)
- Keep old fields (`content`, `inlineMedia`, `contentAfterMedia`, `blocks`) for compatibility, but derive/sync from `editorBlocks` during migration/publish.

### 5) Backward compatibility + migration
Add migration in draft loader:
- Convert legacy drafts (`content + inlineMedia + contentAfterMedia + media.contentAfter`) into ordered `editorBlocks`.
- Preserve existing user content; no data loss.
- If no valid blocks, initialize with one empty text block.

### 6) Publish/detail compatibility
Update publishing and rendering paths so order remains identical after publish:
- `CreateStory.tsx` edit-mode load: map story data into `editorBlocks`.
- `CommunityContext.tsx` publish/update: persist block order and derive legacy fields only as fallback.
- `PublishStep.tsx` and `StoryDetail.tsx`: render from ordered blocks first; fallback to legacy fields for older stories.

## Files planned for update
- `src/hooks/useStoryDrafts.ts`
- `src/components/story-builder/StoryBuilder.tsx`
- `src/components/story-builder/RichTextEditor.tsx` (focus callback support)
- `src/components/story-builder/EditingToolbar.tsx` (insertion anchor callbacks)
- `src/pages/CreateStory.tsx`
- `src/contexts/CommunityContext.tsx`
- `src/components/story-builder/PublishStep.tsx`
- `src/pages/StoryDetail.tsx`
- (optional) `src/lib/storyBuilderBlocks.ts` + tests for insert/migration logic

## Regression test checklist
I’ll verify these flows on desktop and mobile viewport:
1. Image -> Text -> Image: text stays between images.
2. Text -> Image -> Text -> Image: exact order preserved.
3. Multiple consecutive image insertions: no text movement.
4. Edit existing draft with legacy data: content order preserved after migration.
5. Publish and reopen story: rendered order matches builder order exactly.

## Acceptance criteria mapping
- Adding a second image no longer moves prior text.
- Block order is stable and deterministic.
- New media inserts at current active block/cursor context.
- Works in mobile and desktop with no layout jumping.
