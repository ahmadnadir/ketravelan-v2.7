
# Always Visible Caption Input for Images

## Overview
Make the "Add a caption..." input always visible below images so users immediately know they can add captions without needing to click the image first.

---

## Current Behavior
- Caption input is hidden by default
- Users must click/tap on the image to reveal the caption field
- This makes the caption feature less discoverable

---

## Solution
Remove the conditional rendering and `showCaption` state, making the caption input always visible below every image.

---

## Implementation

### InlineImage.tsx Changes

**Remove:**
- The `showCaption` state variable
- The `onClick` handler on the image
- The conditional `{showCaption && ...}` wrapper around the input

**Result:**
```tsx
export function InlineImage({ media, onUpdateCaption, onRemove }: InlineImageProps) {
  const image = media.images[0];

  if (!image) return null;

  return (
    <div className="relative my-8 group">
      {/* Image */}
      <div className="relative">
        <img
          src={image.url}
          alt={image.caption || "Story image"}
          className="w-full h-auto object-cover"
        />
        {/* Remove button */}
        ...
      </div>

      {/* Caption - always visible */}
      <input
        type="text"
        value={image.caption || ""}
        onChange={(e) => onUpdateCaption(e.target.value)}
        placeholder="Add a caption..."
        className="w-full mt-2 text-sm text-muted-foreground text-center bg-transparent border-none outline-none placeholder:text-muted-foreground/50 italic"
      />
    </div>
  );
}
```

---

### InlineGallery.tsx Changes

**Remove:**
- The `showCaption` state variable
- The `onClick` handler on the image
- The `setShowCaption` calls in `goToPrev`, `goToNext`, and dot navigation
- The conditional `{showCaption && ...}` wrapper around the input

**Result:**
```tsx
export function InlineGallery({ media, onUpdateImage, onRemove }: InlineGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = media.images;
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  const goToPrev = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <div className="relative my-8 group">
      {/* Gallery container */}
      ...
      
      {/* Caption - always visible */}
      <input
        type="text"
        value={currentImage.caption || ""}
        onChange={(e) => onUpdateImage(currentIndex, { caption: e.target.value })}
        placeholder="Add a caption..."
        className="w-full mt-2 text-sm text-muted-foreground text-center bg-transparent border-none outline-none placeholder:text-muted-foreground/50 italic"
      />
      ...
    </div>
  );
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/InlineImage.tsx` | Remove `showCaption` state, make caption always visible |
| `src/components/story-builder/InlineGallery.tsx` | Remove `showCaption` state, make caption always visible |

---

## Visual Result

Before (caption hidden):
```text
┌─────────────────────────────────┐
│                                 │
│         [Image]                 │
│                                 │
└─────────────────────────────────┘
                                    ← No caption visible
```

After (caption always visible):
```text
┌─────────────────────────────────┐
│                                 │
│         [Image]                 │
│                                 │
└─────────────────────────────────┘
        Add a caption...            ← Always visible placeholder
```
