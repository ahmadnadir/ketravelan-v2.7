## Revert Coverage Pills to Natural Flex-Wrap

### Problem
The previous grid-based layout (`grid` with `repeat(N, max-content)`) was overengineered and still leaves uneven gaps. The user wants simple, content-sized pills that wrap naturally.

### Change — `src/pages/TripDetails.tsx` (lines 675–697)

Remove the IIFE + grid wrapper and replace with a plain flex-wrap container.

**Replace:**
```tsx
{(() => {
  const count = tripData.coverageCategories.length;
  const cols = count <= 2 ? count : Math.ceil(count / 2);
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}
    >
      {tripData.coverageCategories.map((cat) => { ... })}
    </div>
  );
})()}
```

**With:**
```tsx
<div className="flex flex-wrap items-start gap-2">
  {tripData.coverageCategories.map((cat) => {
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    const emoji = coverageEmojiMap[label] || coverageEmojiMap[cat] || '📦';
    return (
      <PillChip key={cat} label={label} icon={emoji} size="sm" />
    );
  })}
</div>
```

Pills retain natural `inline-flex` width from `PillChip`, wrap on overflow, no stretching, no forced columns.

### Out of scope
- No changes to `PillChip`, emoji map, card layout, disclaimer, or detailed-budget branch.
