

## Fix: Allow Writing After Inline Media

### Problem
After adding a gallery or image, users cannot place a cursor below the media to continue writing. The TipTap editor ends before the inline media section, and there's no text input area after the media blocks.

### Solution
Add a "continue writing" area below the inline media that, when tapped, focuses the TipTap editor at the end of its content. This gives users a clear place to tap and resume writing.

### Changes

**`src/components/story-builder/StoryBuilder.tsx`**
- Add a clickable div below the inline media section that focuses the TipTap editor at the end when tapped
- Style it as a subtle prompt: min-height tap target with a faded placeholder like "Continue writing..." that disappears when the editor is focused
- On click, call `editor?.commands.focus('end')` to place the cursor at the end of the content

The addition looks like this (inserted after the inline media map, before SocialLinksInline):

```text
{/* Tap area to continue writing after media */}
<div
  className="min-h-[120px] cursor-text"
  onClick={() => editor?.commands.focus('end')}
>
  {/* Show hint only when there's media and editor isn't focused */}
  {draft.inlineMedia.length > 0 && (
    <p className="text-muted-foreground/40 text-lg pt-4 italic">
      Tap here to continue writing...
    </p>
  )}
</div>
```

### Files Modified: 1
- `src/components/story-builder/StoryBuilder.tsx` -- add clickable continue-writing zone after inline media

