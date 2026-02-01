

## Fix: Bottom Navigation Layout Alignment with Header

### Problem
The bottom navigation icons stretch across the full viewport width, while the header content is constrained within a centered max-width container. This creates visual inconsistency between the two navigation elements.

### Solution
Add the same container and max-width classes to the bottom navigation that the header uses, so both elements share identical horizontal alignment.

---

### Changes Required

#### File: `src/components/layout/BottomNav.tsx`

**Current code (line 38):**
```tsx
<div className="flex items-center justify-between h-16 sm:h-18 px-2">
```

**Updated code:**
```tsx
<div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6">
```

---

### What This Does

| Element | Before | After |
|---------|--------|-------|
| Container | None | `container mx-auto` |
| Max width | Full viewport | `max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl` |
| Padding | `px-2` | `px-4 sm:px-6` (matches header) |

---

### Visual Result

- **Mobile**: Navigation fills available width naturally (unchanged)
- **Tablet/Desktop**: Navigation icons are centered within the same container width as the header
- **Large displays**: Icons no longer touch screen edges; evenly spaced within the constrained container
- **Background**: Remains full-width (glass effect spans entire bottom)

---

### Design Consistency Achieved

- Same `max-w-*` breakpoints as header
- Same horizontal padding (`px-4 sm:px-6`)
- Same centered alignment (`mx-auto`)
- Icons evenly distributed via `justify-between` within the container

