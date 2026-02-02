

## Location Block Redesign + Trip Location Integration

This plan addresses two goals: (A) updating the Location block UI to match the clean Text block styling, and (B) linking it to trip location data for easier reuse.

---

### Current State Analysis

**LocationBlock.tsx** has:
- Green background: `bg-green-500/10` with `border-green-500/20`
- Green pin icon: `text-green-600`
- Inputs have: `border-0 bg-transparent p-0` - no padding, no visible border
- Very cramped feel with minimal spacing

**TextBlock.tsx** (target style) has:
- Clean neutral styling: `bg-muted/30 rounded-lg border border-border/50`
- Generous padding: `px-4 py-3`
- Auto-grow behavior
- Subtle focus states: `focus:border-primary/50 focus:bg-background`

**Story Draft** has `linkedTripId` field which can reference `mockTrips` data

---

### Part A: Location Block UI/Styling Improvements

#### 1. Remove Green Background

Replace the green-themed container with a neutral style matching TextBlock:

| Before | After |
|--------|-------|
| `bg-green-500/10 border-green-500/20` | No colored background (inputs have their own styling) |
| `text-green-600` pin icon | `text-muted-foreground` neutral icon |

#### 2. Improve Layout Spacing

Update the component structure to be more open:

- **Container**: Remove the colored wrapper entirely, use `space-y-4` for vertical rhythm
- **Location Name Input**: Full-width with proper padding, subtle border, pin icon as prefix
- **Notes Textarea**: Same styling as TextBlock's textarea (`bg-muted/30 rounded-lg border border-border/50 px-4 py-3`)

#### 3. Consistent Input Styling

Both inputs will use:
```css
bg-muted/30 rounded-lg border border-border/50
px-4 py-3 (for textarea) / px-3 py-2.5 (for input)
focus:border-primary/50 focus:bg-background
```

---

### Part B: Link Location Block to Trip Data

#### 1. Props Update

Add new props to LocationBlock:
- `linkedTripId: string | null` - the trip ID from the story draft
- `tripLocation: { country: string; city: string; destination: string } | null` - resolved trip location data

#### 2. Trip Location Resolution

In StoryBuilder, when rendering LocationBlock:
- Look up the linked trip from `mockTrips` using `draft.linkedTripId`
- Extract location fields: `destination` (e.g., "Langkawi, Malaysia")
- Pass to LocationBlock as `tripLocation`

#### 3. "Use Trip Location" Action

Add a helper section in LocationBlock:
- If trip is linked AND `tripLocation` exists:
  - Show: `"From your trip: Langkawi, Malaysia"` with "Use" button
  - Clicking fills `locationName` with the trip destination
- If no trip linked:
  - Show subtle hint: `"Link a trip to auto-fill location"` (non-blocking, informational only)

#### 4. No Auto-Lock

User can always edit the location fields manually. The "Use trip location" button is a convenience, not a requirement.

---

### Technical Implementation

#### File: `src/components/story-builder/blocks/LocationBlock.tsx`

**Complete rewrite with:**

```tsx
import { MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoryBlock, blockTypeConfig } from "@/data/communityMockData";

interface TripLocation {
  destination: string;
  country?: string;
  city?: string;
}

interface LocationBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
  tripLocation?: TripLocation | null;
}

export function LocationBlock({ 
  block, 
  onUpdate, 
  tripLocation 
}: LocationBlockProps) {
  
  const handleUseTripLocation = () => {
    if (tripLocation) {
      onUpdate({ locationName: tripLocation.destination });
    }
  };

  return (
    <div className="space-y-4">
      {/* Trip Location Helper */}
      {tripLocation && (
        <div className="flex items-center justify-between gap-2 text-sm 
                        bg-muted/50 rounded-lg px-3 py-2">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Navigation className="h-3.5 w-3.5" />
            From your trip: {tripLocation.destination}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUseTripLocation}
            className="h-7 px-2 text-xs"
          >
            Use
          </Button>
        </div>
      )}

      {/* Location Name Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 
                           h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={block.locationName || ""}
          onChange={(e) => onUpdate({ locationName: e.target.value })}
          placeholder="Location name (e.g., Langkawi Sky Bridge)"
          className="pl-10 h-11 bg-muted/30 border-border/50 
                     focus-visible:border-primary/50 focus-visible:bg-background"
        />
      </div>

      {/* Notes Textarea */}
      <textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder={blockTypeConfig.location.placeholder}
        className="w-full min-h-[80px] px-4 py-3 text-base 
                   bg-muted/30 rounded-lg border border-border/50
                   placeholder:text-muted-foreground
                   focus:outline-none focus:border-primary/50 focus:bg-background
                   resize-y transition-colors"
      />

      {/* Helper text when no trip linked */}
      {!tripLocation && (
        <p className="text-xs text-muted-foreground">
          Tip: Link a trip to your story to auto-fill locations
        </p>
      )}
    </div>
  );
}
```

---

#### File: `src/components/story-builder/StoryBuilder.tsx`

**Updates needed:**

1. Import `mockTrips` from `@/data/mockData`
2. Resolve trip location when rendering LocationBlock:

```tsx
// Near top of component
const linkedTrip = draft.linkedTripId 
  ? mockTrips.find(t => t.id === draft.linkedTripId) 
  : null;

const tripLocation = linkedTrip 
  ? { destination: linkedTrip.destination } 
  : null;

// In renderBlock function, update location case:
case "location":
  return <LocationBlock {...commonProps} tripLocation={tripLocation} />;
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/story-builder/blocks/LocationBlock.tsx` | Complete rewrite: remove green styling, add neutral inputs, add trip location helper, use proper padding/spacing |
| `src/components/story-builder/StoryBuilder.tsx` | Import mockTrips, resolve linked trip location, pass tripLocation prop to LocationBlock |

---

### Visual Comparison

| Element | Before | After |
|---------|--------|-------|
| Container | Green bg + green border | No wrapper (clean spacing) |
| Pin Icon | Green, inline with input | Neutral, positioned inside input as prefix |
| Location Input | No border, no padding, cramped | Proper Input with `pl-10`, neutral bg, rounded |
| Notes Textarea | No padding, transparent | `px-4 py-3`, `bg-muted/30`, rounded, resizable |
| Trip Integration | None | Shows trip destination with "Use" button |

---

### Acceptance Criteria

- No green UI remaining in Location block
- Location name input has pin icon prefix and proper padding
- Notes textarea matches Text block styling (neutral bg, comfortable padding)
- Placeholder and typed text sit comfortably inside rounded container
- If story has linked trip: shows "From your trip: X" with "Use" button
- If no linked trip: shows helpful tip about linking trips
- User can always edit location fields manually (never locked)
- Responsive on mobile, tablet, and desktop

