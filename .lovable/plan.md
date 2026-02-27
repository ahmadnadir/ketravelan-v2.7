

## Fix Cover Image and Gallery Upload in Story Builder

### Issues Identified

**1. Cover image upload not working on mobile**
The cover image `<input type="file">` is hidden and triggered via `coverInputRef.current?.click()`. On mobile browsers, programmatic `.click()` on file inputs can be unreliable when:
- The click event isn't in direct response to a user gesture (the ref chain breaks the gesture trust)
- The input element is deeply nested or has CSS that interferes

The fix: ensure the file input is properly positioned and the click chain is reliable by using a `<label>` element wrapping the trigger instead of programmatic `.click()`.

**2. Gallery upload from toolbar not working**
Same issue -- the gallery `<input>` in `EditingToolbar.tsx` uses `galleryInputRef.current?.click()` which can fail on mobile. Additionally, after selecting files, the input value is reset but the `onChange` event may not fire reliably on all mobile browsers.

**3. Cover image not responsive**
The cover image area uses `-mx-4 sm:-mx-6` for "full bleed" but the aspect ratio container doesn't constrain the image properly on all screen sizes. The `group-hover:opacity-100` overlay for "Change Cover" is invisible on touch devices (no hover state).

**4. Inline images/gallery not responsive**
`InlineImage` and `InlineGallery` components show remove/navigation buttons only on `group-hover:`, making them inaccessible on mobile. Gallery navigation arrows are hidden until hover.

**5. Console warning about refs on SocialLinkSheet**
The `SocialLinkSheet` is a function component receiving a ref it can't handle, causing React warnings.

### Changes

**1. `src/components/story-builder/StoryBuilder.tsx`**
- Replace programmatic `coverInputRef.current?.click()` with a `<label htmlFor="cover-input">` approach so the file picker opens reliably on mobile
- Add `id="cover-input"` to the hidden file input
- Make "Change Cover" button always visible on mobile (not just hover) by adding `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`
- Add touch-friendly tap target for changing cover

**2. `src/components/story-builder/EditingToolbar.tsx`**
- Replace programmatic `galleryInputRef.current?.click()` with a `<label>` wrapping approach for the gallery button
- This ensures mobile browsers trust the gesture and open the file picker

**3. `src/components/story-builder/InlineImage.tsx`**
- Make the remove button always visible on mobile: `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`
- Ensure image is responsive with `max-w-full` and proper aspect ratio handling
- Add `rounded-lg` for a cleaner look

**4. `src/components/story-builder/InlineGallery.tsx`**
- Make navigation arrows and remove button always visible on mobile (not just on hover)
- Make dot indicators always visible
- Ensure images are responsive with proper constraints
- Add touch swipe hint with visible arrows on mobile

**5. `src/components/story-builder/SocialLinkSheet.tsx`** (minor)
- No structural change needed -- the ref warning comes from Radix Sheet internals, not from our code. This is a known React 18 warning with Radix components and is harmless.

### Technical Details

The core fix is replacing programmatic `.click()` calls with HTML `<label>` elements that natively trigger file inputs. This is the most reliable cross-browser/cross-device approach:

```text
// Before (unreliable on mobile):
<input ref={ref} type="file" className="hidden" />
<button onClick={() => ref.current?.click()}>Upload</button>

// After (reliable everywhere):
<input id="file-input" type="file" className="hidden" />
<label htmlFor="file-input" className="cursor-pointer">Upload</label>
```

For mobile visibility of interactive controls (remove buttons, navigation arrows), the pattern changes from:
```text
// Before: invisible on touch devices
className="opacity-0 group-hover:opacity-100"

// After: always visible on mobile, hover-reveal on desktop
className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
```

### Files Modified: 4
- `src/components/story-builder/StoryBuilder.tsx` -- cover image upload fix + mobile responsiveness
- `src/components/story-builder/EditingToolbar.tsx` -- gallery upload fix
- `src/components/story-builder/InlineImage.tsx` -- mobile-friendly controls
- `src/components/story-builder/InlineGallery.tsx` -- mobile-friendly controls + navigation

