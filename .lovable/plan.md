## Fix Rough Budget Display on Trip Details

### Problem
For `budgetType === 'rough'`, `TripDetails.tsx` (lines 152-158) splits the total budget evenly across selected categories and renders them with amounts (RM 1250 each) under "Budget Breakdown". This misleads users into thinking the budget is allocated per category.

### Solution
Differentiate rendering based on `budgetType`. Rough budgets show a total + coverage pills + disclaimer. Detailed budgets keep their existing per-category breakdown.

### Changes — `src/pages/TripDetails.tsx`

**1. Data normalization (lines 148-166)**
- Stop dividing total by category count for rough budgets.
- Replace `budgetBreakdown` shape with conditional data:
  - For `rough`: only carry `totalBudget` and the raw `roughBudgetCategories` list (coverage labels). Set `budgetBreakdown = []`.
  - For `detailed`: keep current per-category amounts.
- Add `budgetType` and `coverageCategories: string[]` to the returned `tripData` object so the renderer can branch.

**2. Render section (lines 650-698)**
Replace the single "Budget Breakdown" card with two branches:

- **Rough branch** (`tripData.budgetType === 'rough'` and `totalBudget > 0`):
  - Card titled **"Rough Budget"** (do NOT rename).
  - Large amount line: `RM {amount}` with subtitle `Per person (estimated)`.
  - Label `This budget may cover:` followed by coverage items rendered as `PillChip` (reuse `src/components/shared/PillChip.tsx`) with the existing category emoji map (Flight ✈️, Stay 🏨, Food 🍴, Transport 🚗, Activities 🎫, fallback 📦). No amounts on pills.
  - Disclaimer block (existing styling `bg-secondary/50 rounded-lg p-2`):
    > "This is an estimated amount to prepare, not a fixed cost or payment to the organizer. Actual spending may be higher or lower depending on bookings, preferences, and shared expenses during the trip."

- **Detailed branch** (`tripData.budgetType === 'detailed'` and `budgetBreakdown.length > 0`):
  - Keep existing "Budget Breakdown" card with per-category rows and total — unchanged.

- **No budget branch**: keep existing "Budget will be discussed in the group" card.

**3. Emoji map**
Extend the existing `categoryEmojiMap` in the rendered section to also cover `Flight` ✈️, `Stay` 🏨 (these come from `BudgetSection.tsx` defaults) so coverage pills get correct icons.

**4. FAQ text (line 388)**
The FAQ uses `tripData.budgetBreakdown` to list inclusions. Update to fall back to `tripData.coverageCategories` when budget is rough so the answer still lists the right items.

### Files
- **Edit**: `src/pages/TripDetails.tsx` — data normalization + budget render block + FAQ string.

### Out of scope
- No changes to `BudgetSection.tsx` (creation flow is correct).
- No changes to detailed budget rendering.
- No data model changes.
