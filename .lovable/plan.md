

## Story Setup Screen Improvements

This plan addresses three main areas:
1. **Layout** - Show the global app header while keeping the progress bar
2. **Story Type** - Rename "Story Focus" and add Lucide icons
3. **Travel Style** - Replace "Tags" with system categories + custom tags

---

### Current State Analysis

**Layout Issue:**
- Currently uses `FocusedFlowLayout` which does NOT include the global Header (logo + notifications)
- Only shows a custom step header with back/close buttons and progress bar

**Story Focus Section:**
- Called "Story Focus (optional)" with plain text pills
- Multi-select with no limit
- Uses emojis from `storyFocusOptions`

**Tags Section:**
- Free-form tag input with suggestions
- No connection to system travel categories

---

### Technical Changes

#### 1. Layout: Show Global Header + Keep Progress Bar

**File: `src/pages/CreateStory.tsx`**

Replace `FocusedFlowLayout` with `AppLayout` to get the global header, then render the step header (with progress bar) as content.

```
Current structure:
┌─────────────────────────────────────────┐
│ Custom Step Header (Back + Title + X)   │
│ Progress Bar                            │
├─────────────────────────────────────────┤
│ Form Content                            │
└─────────────────────────────────────────┘

New structure:
┌─────────────────────────────────────────┐
│ Global Header (Logo + Notifications)    │  ← From AppLayout
├─────────────────────────────────────────┤
│ Step Sub-Header (Back + Title + X)      │  ← Keep existing
│ Progress Bar                            │  ← Keep existing
├─────────────────────────────────────────┤
│ Form Content                            │
└─────────────────────────────────────────┘
```

**Changes:**
- Import `AppLayout` instead of `FocusedFlowLayout`
- Move the step header + progress bar INSIDE the page content
- Make step header sticky within the scroll container

---

#### 2. Story Type: Rename + Add Lucide Icons

**File: `src/data/communityMockData.ts`**

Update `storyFocusOptions` to include Lucide icon names:

| Type | Label | Icon |
|------|-------|------|
| trip-recap | Trip Recap | Map |
| lessons-learned | Lessons Learned | Lightbulb |
| tips-for-others | Tips for Others | MessageCircle |
| destination-guide | Destination Guide | Compass |
| budget-breakdown | Budget Breakdown | Wallet |
| solo-travel | Solo Travel | User |
| first-time-experience | First-Time Experience | Sparkles |

**File: `src/components/story-builder/StorySetupStep.tsx`**

Changes:
- Rename label from "Story Focus" to "Story Type"
- Update helper text to "Choose one (optional). Helps readers know what to expect."
- Import Lucide icons (Map, Lightbulb, MessageCircle, Compass, Wallet, User, Sparkles)
- Render pills with Lucide icon + label
- Keep multi-select but suggest "pick one" in copy
- Optional: Cap at max 2 selections

**Pill styling (selected state):**
```css
Selected: bg-primary/10 border-primary text-foreground + Check icon
Unselected: bg-background border-border text-muted-foreground
```

---

#### 3. Travel Style: System Categories + Custom Tags

**File: `src/data/communityMockData.ts`**

Add new Travel Style options with Lucide icons (mapped to system categories):

| ID | Label | Icon |
|----|-------|------|
| nature-outdoor | Nature & Outdoor | Leaf |
| adventure | Adventure | Mountain |
| beach | Beach | Waves |
| food | Food & Culinary | Utensils |
| city-urban | City & Urban | Building2 |
| culture | Culture | Landmark |
| hiking | Hiking | Footprints |
| photography | Photography | Camera |
| backpacking | Backpacking | Backpack |
| budget | Budget-friendly | BadgeDollarSign |

**File: `src/hooks/useStoryDraft.ts`**

Add new field to `StoryDraft` interface:
```typescript
travelStyles: string[];  // Array of travel style IDs
```

**File: `src/components/story-builder/StorySetupStep.tsx`**

Replace the current Tags section with a two-part structure:

**A) Travel Style (Primary)**
- Label: "Travel Style"
- Helper: "Pick the travel styles that match this story."
- Multi-select pills with Lucide icons
- Uses system categories for consistency

**B) Add a Tag (Secondary)**
- Label: "Add a Tag (optional)"
- Helper: "For extra keywords like destinations, experiences, etc."
- Keep existing free-form input
- Move below Travel Style section

**Form Section Order:**
1. Story Title
2. Story Type (optional) - with Lucide icons
3. Travel Style - system categories with Lucide icons
4. Add a Tag (optional) - free-form input
5. Destination
6. Link to Trip

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/CreateStory.tsx` | Switch from FocusedFlowLayout to AppLayout; make step header part of content with sticky positioning |
| `src/components/story-builder/StorySetupStep.tsx` | Rename Story Focus → Story Type; add Lucide icons to pills; add Travel Style section with system categories; reorganize Tags as secondary "Add a Tag" |
| `src/data/communityMockData.ts` | Add `icon` field to storyFocusOptions; add new `travelStyleOptions` array with Lucide icon names |
| `src/hooks/useStoryDraft.ts` | Add `travelStyles: string[]` to StoryDraft interface and defaultDraft |

---

### Detailed Component Changes

#### StorySetupStep.tsx - New Structure

```tsx
// Imports: Add Lucide icons
import { 
  Map, Lightbulb, MessageCircle, Compass, Wallet, User, Sparkles,
  Leaf, Mountain, Waves, Utensils, Building2, Landmark, Footprints, 
  Camera, Backpack, BadgeDollarSign, Check, MapPin, Link2, ChevronRight 
} from "lucide-react";

// State: Add travelStyles
const [travelStyles, setTravelStyles] = useState<string[]>(draft.travelStyles || []);

// Story Type section (replaces Story Focus)
<div className="space-y-3">
  <Label>Story Type</Label>
  <p className="text-sm text-muted-foreground">
    Choose one (optional). Helps readers know what to expect.
  </p>
  <div className="flex flex-wrap gap-2">
    {storyTypeOptions.map((option) => {
      const Icon = iconMap[option.icon];
      const selected = storyTypes.includes(option.value);
      return (
        <button className={selectedStyles}>
          {selected && <Check className="h-3.5 w-3.5" />}
          <Icon className="h-4 w-4" />
          {option.label}
        </button>
      );
    })}
  </div>
</div>

// Travel Style section (new)
<div className="space-y-3">
  <Label>Travel Style</Label>
  <p className="text-sm text-muted-foreground">
    Pick the travel styles that match this story.
  </p>
  <div className="flex flex-wrap gap-2">
    {travelStyleOptions.map((style) => {
      const Icon = iconMap[style.icon];
      const selected = travelStyles.includes(style.id);
      return (
        <button className={selectedStyles}>
          {selected && <Check className="h-3.5 w-3.5" />}
          <Icon className="h-4 w-4" />
          {style.label}
        </button>
      );
    })}
  </div>
</div>

// Add a Tag section (secondary, below Travel Style)
<div className="space-y-3">
  <Label>Add a Tag (optional)</Label>
  <p className="text-sm text-muted-foreground">
    For extra keywords like destinations, experiences, etc.
  </p>
  {/* Existing tag input UI */}
</div>
```

---

### Visual Pill Styling (Consistent with TravelStylePills)

**Unselected:**
```css
bg-secondary text-foreground border border-transparent rounded-full px-4 py-2.5
hover:bg-secondary/80
```

**Selected:**
```css
bg-foreground text-background border border-foreground rounded-full px-4 py-2.5
+ Check icon prefix
```

---

### Data Structure Updates

#### communityMockData.ts additions:

```typescript
// Story Type options with Lucide icon names
export const storyTypeOptions: { 
  value: StoryFocus; 
  label: string; 
  icon: string; 
}[] = [
  { value: "trip-recap", label: "Trip Recap", icon: "Map" },
  { value: "lessons-learned", label: "Lessons Learned", icon: "Lightbulb" },
  { value: "tips-for-others", label: "Tips for Others", icon: "MessageCircle" },
  { value: "destination-guide", label: "Destination Guide", icon: "Compass" },
  { value: "budget-breakdown", label: "Budget Breakdown", icon: "Wallet" },
  { value: "solo-travel", label: "Solo Travel", icon: "User" },
  { value: "first-time-experience", label: "First-Time Experience", icon: "Sparkles" },
];

// Travel Style options with Lucide icon names
export type TravelStyleId = 
  | "nature-outdoor" | "adventure" | "beach" | "food" 
  | "city-urban" | "culture" | "hiking" | "photography" 
  | "backpacking" | "budget";

export const travelStyleOptions: { 
  id: TravelStyleId; 
  label: string; 
  icon: string; 
}[] = [
  { id: "nature-outdoor", label: "Nature & Outdoor", icon: "Leaf" },
  { id: "adventure", label: "Adventure", icon: "Mountain" },
  { id: "beach", label: "Beach", icon: "Waves" },
  { id: "food", label: "Food & Culinary", icon: "Utensils" },
  { id: "city-urban", label: "City & Urban", icon: "Building2" },
  { id: "culture", label: "Culture", icon: "Landmark" },
  { id: "hiking", label: "Hiking", icon: "Footprints" },
  { id: "photography", label: "Photography", icon: "Camera" },
  { id: "backpacking", label: "Backpacking", icon: "Backpack" },
  { id: "budget", label: "Budget-friendly", icon: "BadgeDollarSign" },
];
```

---

### Acceptance Criteria

| Requirement | Solution |
|-------------|----------|
| Global header visible | Switch to AppLayout, header included automatically |
| Progress bar visible | Step sub-header with progress bar rendered as sticky content |
| "Story Focus" → "Story Type" | Label renamed, helper text updated |
| Story Type uses Lucide icons | Icon component rendered in each pill |
| Pill styling matches system | Same styles as TravelStylePills component |
| "Tags" → "Travel Style" | New section with system categories |
| Custom tags still available | "Add a Tag" section moved below Travel Style |

