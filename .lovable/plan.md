

## Plan: Add Save as Draft Button and Improve Draft Recovery Experience

This plan adds a "Save as Draft" button during the writing phase and improves the draft detection/recovery flow when users start a new story.

---

### Overview

Currently, the "Save as Draft" button only appears at the final publish step. Users writing stories should be able to explicitly save and exit at any point. Additionally, when a user has an existing draft and navigates to create a new story, they should be clearly prompted to either continue or start fresh.

---

### Changes

#### 1. Add "Save as Draft" Button to Story Builder Step

**File: `src/components/story-builder/StoryBuilder.tsx`**

Update the bottom CTA area to include a secondary "Save as Draft" button alongside the "Continue to Review" button:

- Add `onSaveAsDraft` prop to the component
- Show the "Save as Draft" button as a secondary action (ghost/outline variant)
- Position it below the primary CTA or as a text link

```text
Current Layout:
+----------------------------+
| [Continue to Review]       |
| "You can edit later"       |
+----------------------------+

New Layout:
+----------------------------+
| [Continue to Review]       |
| [Save as Draft]           |
+----------------------------+
```

#### 2. Pass Save Handler from CreateStory Page

**File: `src/pages/CreateStory.tsx`**

- Pass the existing `handleSaveAsDraft` function to the `StoryBuilder` component via a new prop

#### 3. Improve Draft Detection Logic

**File: `src/pages/CreateStory.tsx`**

Current logic only shows the banner if `hasDraft && draft.title`. Update to also detect:
- Any content in the story
- Any cover image
- Any inline media

This ensures users see the recovery prompt even if they started writing but didn't add a title yet.

#### 4. Enhance Draft Banner UX

**File: `src/components/story-builder/DraftBanner.tsx`**

- Add a preview of what's in the draft (e.g., title if available, or "Untitled story with X words")
- Make the banner more visually prominent with better spacing

---

### Technical Details

**StoryBuilder.tsx Changes:**
```tsx
interface StoryBuilderProps {
  // ... existing props
  onSaveAsDraft: () => void;  // NEW
}

// In the bottom CTA area:
<Button onClick={handleContinueClick} className="w-full" size="lg">
  Continue to Review
</Button>
<Button onClick={onSaveAsDraft} variant="ghost" className="w-full">
  Save as Draft
</Button>
```

**CreateStory.tsx Changes:**
```tsx
// Enhanced draft detection
useEffect(() => {
  const hasMeaningfulDraft = hasDraft && (
    draft.title || 
    draft.content.trim().length > 0 || 
    draft.coverImage || 
    draft.inlineMedia.length > 0
  );
  if (hasMeaningfulDraft && !editingStoryId) {
    setShowDraftBanner(true);
  }
}, [hasDraft, draft, editingStoryId]);

// Pass handler to StoryBuilder
<StoryBuilder
  // ... existing props
  onSaveAsDraft={handleSaveAsDraft}
/>
```

**DraftBanner.tsx Changes:**
```tsx
interface DraftBannerProps {
  lastSaved: Date;
  draftPreview?: string;  // NEW: e.g., "My Trip to Bali" or "Untitled (150 words)"
  onResume: () => void;
  onStartFresh: () => void;
}
```

---

### User Flow After Changes

1. **User opens Create Story with existing draft:**
   - Banner appears: "You were writing a story recently. Want to continue?"
   - Shows draft title or "Untitled story" with word count
   - Options: "Continue writing" or "Start fresh"

2. **User writing a story wants to save and exit:**
   - In Story Builder step: "Save as Draft" button visible below "Continue to Review"
   - Clicking saves the draft and navigates back to Community
   - Toast confirms: "Story saved as draft"

3. **User tries to close/back with unsaved changes:**
   - Existing exit dialog appears offering "Save Draft" or "Discard"

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Add `onSaveAsDraft` prop, add "Save as Draft" button in CTA area |
| `src/pages/CreateStory.tsx` | Pass `handleSaveAsDraft` to StoryBuilder, improve draft detection logic |
| `src/components/story-builder/DraftBanner.tsx` | Add optional draft preview text prop for better context |

