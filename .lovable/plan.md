

## Fix: Text Pushed After New Images

### Problem
When you write text after image 1, then add image 2, all media renders in a single block with only one shared textarea at the very bottom. The new image gets inserted before the textarea, pushing your text below all images.

### Solution
Give each inline media item its own "content after" text field. This creates an interleaved layout: Editor -> Image 1 -> Text area 1 -> Image 2 -> Text area 2, so adding a new image never displaces existing text.

### Changes

**1. `src/hooks/useStoryDrafts.ts`**
- Add a `contentAfter` field to the `InlineMedia` interface so each media block stores its own follow-up text

**2. `src/components/story-builder/StoryBuilder.tsx`**
- Replace the single shared `<textarea>` at the bottom with a per-media textarea rendered directly below each `InlineImage` / `InlineGallery`
- Each textarea saves to its own media item's `contentAfter` field via `updateInlineMedia(media.id, { contentAfter: value })`
- Remove the dependency on `draft.contentAfterMedia` for this purpose
- Always show a textarea after the last media item (with placeholder "Continue writing...")

### Technical Detail

Current layout:
```text
[TipTap Editor]
[Image 1]
[Image 2]        <-- pushes textarea down
[Single textarea]
```

Fixed layout:
```text
[TipTap Editor]
[Image 1]
[Textarea for Image 1]   <-- text stays here
[Image 2]
[Textarea for Image 2]
```

### Files Modified: 2
- `src/hooks/useStoryDrafts.ts` -- add `contentAfter` to `InlineMedia`
- `src/components/story-builder/StoryBuilder.tsx` -- per-media textarea instead of single shared one

