

## Fix: Replace Expenses with Community in Bottom Nav

### Problem
The bottom navigation bar currently shows "Expenses" as the 4th tab, but it should show "Community" instead. This was previously changed incorrectly.

### Solution
Update the `BottomNav.tsx` component to replace the Expenses tab with Community.

---

### Changes Required

**File: `src/components/layout/BottomNav.tsx`**

1. **Update imports** (line 1):
   - Remove `Receipt` icon
   - Add `Users` icon for Community

2. **Update navItems array** (line 16):
   - Change from: `{ icon: Receipt, label: "Expenses", path: "/expenses" }`
   - Change to: `{ icon: Users, label: "Community", path: "/community" }`

---

### Before vs After

| Position | Before | After |
|----------|--------|-------|
| 1 | Explore | Explore |
| 2 | Chat | Chat |
| 3 | Create | Create |
| 4 | **Expenses** | **Community** |
| 5 | Profile | Profile |

---

### Note
Expenses will remain accessible through:
- The side menu drawer (already has Expenses link)
- Direct navigation to `/expenses`

