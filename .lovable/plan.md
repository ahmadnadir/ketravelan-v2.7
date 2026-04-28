## Tighten Rough Budget coverage pill layout

### Problem
The `flex flex-wrap` container for "This budget may cover:" pills fills the row with as many pills as fit at full width, so 5 items render as 4 on top + 1 lonely pill below, leaving a large empty gap.

### Goal
Balance the rows so pills are split roughly evenly across two rows:
- 5 pills → 3 on top, 2 on bottom
- 4 pills → 2 on top, 2 on bottom
- 3 pills → 2 on top, 1 on bottom
- ≤2 pills → single row

### Change — `src/pages/TripDetails.tsx` (lines ~672-690)

Replace the `flex flex-wrap gap-2` wrapper with a CSS Grid that has a dynamic column count equal to `Math.ceil(count / 2)`, so the items naturally split into two balanced rows. Pills keep their natural width via `justify-self-start` (no stretching).

Logic:
```tsx
const count = tripData.coverageCategories.length;
const cols = count <= 2 ? count : Math.ceil(count / 2);
// 5 -> 3 cols (3+2), 4 -> 2 cols (2+2), 3 -> 2 cols (2+1)
```

Replace the wrapper:
```tsx
<div
  className="grid gap-2"
  style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}
>
  {tripData.coverageCategories.map((cat) => (
    <PillChip ... />   // unchanged
  ))}
</div>
```

Using inline `gridTemplateColumns` with `max-content` keeps pills their natural size (no stretched/oversized chips) while guaranteeing the row break happens after `cols` items, producing the requested 3+2 / 2+2 layout.

### Out of scope
- No changes to PillChip styling, emoji map, disclaimer, or detailed-budget branch.
- No data-model changes.
