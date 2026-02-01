

## Fix: Community CTA Button Positioning & Alignment

### Problems Identified

1. **Container mismatch**: Desktop CTA uses `max-w-5xl` but AppLayout uses `max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl` - they don't align
2. **Invalid CSS on mobile**: Mobile CTA has both `bottom-0` and `bottom-above-nav` applied simultaneously
3. **Duplicate code**: CTA logic is copied between StoriesFeed and DiscussionsFeed
4. **Bottom spacing inconsistent**: Current `bottom-above-nav` utility doesn't properly account for padding

---

### Solution Architecture

**Strategy**: Extract CTA into a shared component and fix positioning to match the AppLayout container exactly.

---

### Changes Required

#### 1. Create Shared CTA Component
**File**: `src/components/community/CommunityCTA.tsx` (new)

Create a reusable floating CTA component that:
- Takes `mode` prop ("stories" | "discussions") to show correct label/icon
- Uses consistent positioning across both tabs
- Matches AppLayout container widths exactly

```text
┌─────────────────────────────────────────────────────────┐
│  Header (max-w-lg → max-w-4xl)                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────┐                │
│  │  Content Container                  │                │
│  │  (same max-width as header)         │                │
│  │                                     │                │
│  │                           ┌───────┐ │                │
│  │                           │  CTA  │ │  ← aligned     │
│  │                           └───────┘ │    to container│
│  └─────────────────────────────────────┘                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Bottom Nav (full width bg, centered items)             │
└─────────────────────────────────────────────────────────┘
```

#### 2. Update CSS Variables
**File**: `src/index.css`

Add CSS custom properties for consistent spacing:
```css
:root {
  --bottom-nav-height: 4rem;
  --cta-bottom-offset: 1rem;
}
```

Update the `bottom-above-nav` utility to use these variables properly.

#### 3. Update StoriesFeed
**File**: `src/components/community/stories/StoriesFeed.tsx`

- Remove inline CTA code (both desktop and mobile versions)
- Increase bottom padding on content for CTA clearance: `pb-32` (ensures last card isn't hidden)

#### 4. Update DiscussionsFeed
**File**: `src/components/community/discussions/DiscussionsFeed.tsx`

- Remove inline CTA code (both desktop and mobile versions)
- Increase bottom padding on content: `pb-32`

#### 5. Update Community Page
**File**: `src/pages/Community.tsx`

- Import and render the shared `CommunityCTA` component
- Pass the current `mode` so it displays correct label/icon
- CTA is rendered once at the Community page level (not duplicated in each feed)

---

### Technical Implementation Details

#### CommunityCTA Component Structure
```tsx
interface CommunityCTAProps {
  mode: "stories" | "discussions";
  onAction: () => void;
}

export function CommunityCTA({ mode, onAction }: CommunityCTAProps) {
  const config = {
    stories: { icon: PenSquare, label: "Share Your Story" },
    discussions: { icon: MessageSquarePlus, label: "Ask the Community" }
  };
  
  return (
    <>
      {/* Desktop: Floating button aligned to container */}
      <div className="hidden sm:block fixed z-40 pointer-events-none"
           style={{ bottom: 'calc(4rem + 1rem + env(safe-area-inset-bottom))' }}>
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 flex justify-end">
          <Button className="pointer-events-auto rounded-full shadow-lg">
            {icon} {label}
          </Button>
        </div>
      </div>
      
      {/* Mobile: Full-width sticky bar */}
      <div className="sm:hidden fixed left-0 right-0 z-40 p-4 glass border-t"
           style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
        <Button className="w-full">
          {icon} {label}
        </Button>
      </div>
    </>
  );
}
```

#### Key Positioning Fix
- **Desktop**: Use the **exact same container classes** as Header and AppLayout: `container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6`
- **Mobile**: Full-width with proper bottom offset using inline style for calc()
- **Bottom offset**: `calc(4rem + 1rem + env(safe-area-inset-bottom))` ensures:
  - 4rem = bottom nav height
  - 1rem = spacing gap
  - env(safe-area-inset-bottom) = iOS safe area

#### Animation for Tab Switch
Add transition classes for smooth appearance:
```tsx
className="transition-opacity duration-150 ease-out"
```

---

### Files to Modify

| File | Action |
|------|--------|
| `src/components/community/CommunityCTA.tsx` | Create new |
| `src/components/community/stories/StoriesFeed.tsx` | Remove CTA code, update padding |
| `src/components/community/discussions/DiscussionsFeed.tsx` | Remove CTA code, update padding |
| `src/pages/Community.tsx` | Add shared CTA component |

---

### Acceptance Criteria Checklist

| Requirement | Solution |
|-------------|----------|
| CTA within same container width as content | Uses identical max-width classes as Header/AppLayout |
| Aligned with content right edge | `flex justify-end` inside same container |
| Sits above bottom navbar with clear spacing | `bottom: calc(4rem + 1rem + env(safe-area-inset-bottom))` |
| Respects iOS safe area | Uses `env(safe-area-inset-bottom)` |
| No overlap with navbar | Explicit offset calculation |
| Consistent between tabs | Single component, mode prop switches icon/label |
| No jump when switching tabs | Component stays mounted, only icon/label changes |
| Last card not hidden | Content padding increased to `pb-32` |

