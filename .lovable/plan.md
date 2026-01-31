

## Fix: Show Top Navbar on Discussion Detail Page

### Problem
The Discussion Detail page (`/community/discussions/:id`) is missing the global top navigation bar (with logo, notifications, and menu). This is because `AppLayout` is being used with `hideHeader` prop set to `true`.

### Current Code (Line 56)
```tsx
<AppLayout hideHeader>
```

### Solution
Remove the `hideHeader` prop so the global header is shown, and update the page-level header to be a contextual sub-header instead.

---

### Changes Required

#### File: `src/pages/DiscussionDetail.tsx`

1. **Remove `hideHeader` prop** from `AppLayout` (line 56)
   - Change: `<AppLayout hideHeader>` → `<AppLayout>`

2. **Update the page header styling** to work as a sub-header below the global nav
   - Remove `sticky top-0 z-50` positioning (since the global header handles the sticky behavior)
   - Keep the back button and "Discussion" title as contextual navigation

3. **Update back button link** to include `?tab=discussions` for proper tab persistence (similar to StoryDetail fix)

---

### Before/After

**Before:**
- No global header (logo, notifications, menu missing)
- Only custom "Discussion" header with back button

**After:**
- Global header visible at top (logo, notifications bell, menu)
- Sub-header below with back button and "Discussion" title
- Bottom navigation visible

---

### Visual Result
The page will have:
1. Global header (Ketravelan logo + notifications + menu) at the top
2. Discussion sub-header with back arrow + "Discussion" title
3. Discussion content
4. Reply input at bottom
5. Bottom navigation bar

