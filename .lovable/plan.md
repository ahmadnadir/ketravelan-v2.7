
## Plan: Fix Story Preview to Show Full Content

This plan ensures the Story Preview page accurately reflects all content written in Step 2 (Story Builder).

---

### Issues Identified

| Issue | Current State | Fix |
|-------|---------------|-----|
| Text after gallery missing | Only `content` is shown | Add `contentAfterMedia` to preview |
| Gallery captions missing | Shows "X photos in gallery" only | Display each image caption |
| Social Links section visible | Shows Instagram/YouTube/TikTok buttons | Remove entire section |

---

### Changes

#### File: `src/components/story-builder/PublishStep.tsx`

**1. Add Content After Media to Preview**

After the inline media section, add rendering for `contentAfterMedia`:

```tsx
{/* Content After Media */}
{draft.contentAfterMedia && (
  <p className="text-sm text-foreground whitespace-pre-wrap">
    {draft.contentAfterMedia}
  </p>
)}
```

**2. Show Gallery Captions**

Update the gallery section to display individual captions for each image, not just "X photos in gallery":

```tsx
{media.type === "gallery" && media.images.length > 0 && (
  <div>
    <Carousel className="w-full">
      <CarouselContent>
        {media.images.map((img, index) => (
          <CarouselItem key={index} className="basis-2/3">
            <div className="space-y-1">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={img.url}
                  alt={img.caption || `Gallery image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              </div>
              {img.caption && (
                <p className="text-xs text-muted-foreground text-center italic">
                  {img.caption}
                </p>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    <p className="text-xs text-muted-foreground mt-2 text-center">
      {media.images.length} photos in gallery
    </p>
  </div>
)}
```

**3. Remove Social Links Section**

Remove the entire "Social Links (Optional)" section (lines 206-268) that includes:
- The section label "Social Links (Optional)"
- The helper text
- Existing links display
- Instagram/YouTube/TikTok add buttons

The selected social links from Step 2 are already displayed in the preview card above (lines 189-201), so this section is redundant.

---

### Summary

The preview will now show:
1. Cover image
2. Story type and focus badges
3. Title and location
4. Main content text
5. Inline images/galleries with their captions
6. Text written after media (contentAfterMedia)
7. Selected social links (already in preview card)
8. Visibility options
9. Action buttons
