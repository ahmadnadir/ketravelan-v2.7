
# Story Setup Flow Improvements

## Overview
Streamline the Story Setup screen to reduce friction, increase flexibility, and make it feel less like a rigid form. Users should be able to express their stories naturally while keeping content discoverable.

---

## Changes Summary

| Section | Current State | Change |
|---------|---------------|--------|
| Story Type | Fixed pills only | Add "+ Add custom" inline input |
| Travel Style | Fixed pills only | Add "+ Add custom" inline input |
| Tags section | Full input + display | **Remove entirely** |
| Country field | Required (*) | Make optional, remove asterisk |
| Trip linking | Always shows trip cards | Add yes/no question first |
| Continue button | Requires title + country | Requires title only |

---

## Detailed Implementation

### 1. Custom Story Type & Travel Style Pills

**Behaviour:**
- Add a "+ Add custom" pill at the end of each pills row
- On tap, shows an inline text input (styled as a chip with an embedded input)
- User types custom label (e.g., "Van Life", "Ramadan Trip")
- On Enter/blur/submit: converts to a regular pill and auto-selects it
- Custom pills are visually identical to predefined ones
- Custom pills include an "x" to remove them

**State updates:**
- Add `customStoryTypes: string[]` to track user-created story types
- Add `customTravelStyles: string[]` to track user-created travel styles  
- Selected custom items stored in existing `storyFocuses` and `travelStyles` arrays

**UI pattern:**
```text
[Trip Recap] [Lessons Learned] [...] [+ Add custom]
                                         ↓ (on tap)
[Trip Recap] [Lessons Learned] [...] [__________] [Add]
                                         ↓ (on submit)
[Trip Recap] [Lessons Learned] [...] [Van Life x] [+ Add custom]
```

---

### 2. Remove Tags Section

**Remove entirely:**
- "Add a Tag (optional)" label
- Helper text
- Tags display badges
- Tag input field + Add button
- All tag-related state (`tags`, `tagInput`, `addTag`, `removeTag`, `normalizeTag`)

**Rationale:** Redundant with Story Type, Travel Style, and destination data.

---

### 3. Make Country Optional

**Changes:**
- Remove `<span className="text-destructive">*</span>` from country label
- Update label from "Where did this happen? *" to "Where did this happen?"
- Update validation: `isValid = normalizedTitle` (title only required)
- Keep country/city inputs functional but optional

---

### 4. Trip Linking - Conditional with Yes/No Question

**New flow:**
```text
"Do you want to link this story to a trip?"
[ Yes ]  [ No ]

If Yes is selected:
  ↓ (reveal with animation)
  
  Upcoming Trips
  ┌────────────────────────────┐
  │ Bali Getaway               │
  │ Indonesia • Starts in 3d   │
  └────────────────────────────┘
  
  Past Trips  
  ┌────────────────────────────┐
  │ Vietnam Adventure          │
  │ Vietnam                    │
  └────────────────────────────┘
  ┌────────────────────────────┐
  │ Japan Solo Trip            │
  │ Japan                      │
  └────────────────────────────┘
```

**State:**
- Add `wantToLinkTrip: boolean | null` (null = not answered yet)
- When "No" selected: hide trip cards, clear any linked trip
- When "Yes" selected: reveal trip sections with smooth animation
- Trip selection remains optional even after selecting "Yes"

**Mock data structure:**
```ts
const mockUpcomingTrips = [
  { id: "trip-upcoming-1", title: "Bali Getaway", destination: "Indonesia", startsIn: "3 days" }
];

const mockPastTrips = [
  { id: "trip-1", title: "Vietnam Adventure", destination: "Vietnam" },
  { id: "trip-2", title: "Japan Solo Trip", destination: "Japan" },
];
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/StorySetupStep.tsx` | All UI changes above |
| `src/hooks/useStoryDraft.ts` | Add `customStoryTypes`, `customTravelStyles` to draft interface |

---

## Technical Details

### New State Variables in StorySetupStep
```ts
// Custom entries
const [customStoryTypes, setCustomStoryTypes] = useState<string[]>([]);
const [customTravelStyles, setCustomTravelStyles] = useState<string[]>([]);
const [showCustomStoryInput, setShowCustomStoryInput] = useState(false);
const [showCustomStyleInput, setShowCustomStyleInput] = useState(false);
const [customStoryInput, setCustomStoryInput] = useState("");
const [customStyleInput, setCustomStyleInput] = useState("");

// Trip linking
const [wantToLinkTrip, setWantToLinkTrip] = useState<boolean | null>(null);
```

### Updated Draft Interface
```ts
export interface StoryDraft {
  // ... existing fields
  customStoryTypes: string[];   // NEW
  customTravelStyles: string[]; // NEW
}
```

### Validation Logic
```ts
// Before: const isValid = normalizedTitle && country;
// After:
const isValid = Boolean(normalizedTitle);
```

---

## UX Principles Maintained

- All inputs optional except title
- No hard stops before "Continue to Story Builder"
- Progressive disclosure for trip linking
- Inline interactions only (no modals)
- Custom entries visually match system pills
- Screen feels lighter and more creator-friendly
