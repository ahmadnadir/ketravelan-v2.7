
## Plan: Standardize Action Buttons Across Create Story Flow

This plan standardizes the action button containers and removes the draft recovery banner across all steps of the story creation process.

---

### Summary of Changes

| Step | Current State | After Changes |
|------|---------------|---------------|
| Story Setup | Sticky bottom bar | Keep as-is (reference style) |
| Story Builder | Floating rounded container | Change to sticky bar like Setup |
| Story Preview | Stacked buttons, title "Review & Publish" | Side-by-side buttons, title "Story Preview" |
| Draft Banner | Shows on builder step | Remove completely |

---

### Changes

#### 1. Story Builder - Change Container to Sticky

**File: `src/components/story-builder/StoryBuilder.tsx`**

Current floating container with rounded corners and shadow:
```text
fixed bottom-20 ... rounded-xl shadow-lg border ...
```

Change to sticky style matching Story Setup:
```text
fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50
```

This removes the floating card appearance and makes it a full-width sticky bar at the bottom.

#### 2. Story Preview (Publish Step) - Update Layout and Title

**File: `src/pages/CreateStory.tsx`**

Update the step label for the publish step:
- Change from "Review & Publish" to "Story Preview"

**File: `src/components/story-builder/PublishStep.tsx`**

Update the action buttons from stacked to side-by-side layout:

Current layout:
```text
+----------------------------+
| [Publish Story]            |  <- full width, stacked
+----------------------------+
| [Save as Draft]            |  <- full width, stacked
+----------------------------+
```

New layout (matching Story Builder):
```text
+----------------------------+
| [Publish] | [Save as Draft]|  <- side-by-side
+----------------------------+
```

- Publish button on LEFT (primary style)
- Save as Draft on RIGHT (outline style)

#### 3. Remove Draft Banner

**File: `src/pages/CreateStory.tsx`**

Remove the draft banner rendering entirely. The banner component can remain in the codebase for potential future use, but it will not be shown during the create story process.

Changes:
- Remove the `showDraftBanner` state logic
- Remove the `DraftBanner` component from the JSX
- Keep the draft detection logic for auto-saving, but don't show the visual banner

---

### Technical Implementation

**StoryBuilder.tsx - Bottom CTA Container:**
```tsx
// BEFORE:
<div className="fixed bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl sm:px-4 md:max-w-2xl lg:max-w-4xl z-40">
  <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-3 sm:p-4 flex gap-2 sm:gap-3">

// AFTER:
<div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50">
  <div className="container max-w-3xl mx-auto flex gap-3">
```

**PublishStep.tsx - Button Layout:**
```tsx
// BEFORE (stacked):
<div className="container max-w-3xl mx-auto space-y-2">
  <Button onClick={handlePublish} className="w-full" size="lg">
    {isEditing ? "Update Story" : "Publish Story"}
  </Button>
  <Button onClick={handleSaveDraft} variant="outline" className="w-full" size="lg">
    Save as Draft
  </Button>
</div>

// AFTER (side-by-side):
<div className="container max-w-3xl mx-auto flex gap-3">
  <Button onClick={handlePublish} className="flex-1" size="lg">
    {isEditing ? "Update" : "Publish"}
  </Button>
  <Button onClick={handleSaveDraft} variant="outline" className="flex-1" size="lg">
    Save as Draft
  </Button>
</div>
```

**CreateStory.tsx - Step Label:**
```tsx
const stepLabels: Record<Step, string> = {
  setup: "Story Setup",
  builder: "Story Builder",
  publish: "Story Preview",  // Changed from "Review & Publish"
};
```

**CreateStory.tsx - Remove Draft Banner:**
```tsx
// Remove this state:
// const [showDraftBanner, setShowDraftBanner] = useState(false);

// Remove this useEffect:
// useEffect(() => { ... setShowDraftBanner(true) ... }, [...]);

// Remove this JSX:
// {showDraftBanner && ( <DraftBanner ... /> )}
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StoryBuilder.tsx` | Change bottom CTA from floating card to sticky bar |
| `src/components/story-builder/PublishStep.tsx` | Change buttons from stacked to side-by-side (Publish left, Save as Draft right) |
| `src/pages/CreateStory.tsx` | Change "Review & Publish" label to "Story Preview", remove draft banner completely |
