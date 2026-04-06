

## Fix Build Errors + Standardise "What to Expect" with Emoji Pills

### 1. Fix 3 `NodeJS.Timeout` build errors

Replace `NodeJS.Timeout` with `ReturnType<typeof setTimeout>` in:
- `src/components/trip-hub/NoteEditor.tsx` line 48
- `src/components/trip-hub/TripItinerary.tsx` line 25
- `src/hooks/useDraftTrip.ts` line 70

### 2. Standardise "What to Expect" on Trip Details page

**Current**: Plain bullet list with dots (image 2)
**Target**: Emoji pill chips matching the creation form style (image 1)

**Approach**:
- Extract the `expectationCategories` emoji lookup map from `RequirementsSection.tsx` into a shared utility (or import directly)
- In `TripDetails.tsx` (lines 633-644), replace the `<ul>` bullet list with a `flex flex-wrap gap-2` container of styled pill chips
- Each requirement gets matched to its emoji from the predefined map; custom/unmatched requirements get a fallback emoji (📦)
- Pill styling: `px-3 py-1.5 text-sm rounded-full border border-border bg-white text-muted-foreground` — matching the unselected chip style from the creation form

### Files changed
- **`src/components/trip-hub/NoteEditor.tsx`** — line 48: `NodeJS.Timeout` → `ReturnType<typeof setTimeout>`
- **`src/components/trip-hub/TripItinerary.tsx`** — line 25: same fix
- **`src/hooks/useDraftTrip.ts`** — line 70: same fix
- **`src/lib/expectationUtils.ts`** — new file: export the emoji lookup map from expectation categories
- **`src/pages/TripDetails.tsx`** — lines 633-644: replace bullet list with emoji pill chips

