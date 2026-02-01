
## Fix: Show Top Navbar on User Profile View Page

### Problem
The User Profile View page (`/user/:userId`) is missing the global top navigation bar (with logo, notifications, and menu). This is because it uses `FocusedFlowLayout` with a custom header instead of `AppLayout`.

### Current Architecture
```tsx
<FocusedFlowLayout
  headerContent={headerContent}  // Custom header with only back button
  footerContent={footerContent}
  showBottomNav={true}
>
```

### Solution
Switch to `AppLayout` (like other pages) to get the global header, and keep the sub-header as contextual navigation within the content area.

---

### Changes Required

#### File: `src/pages/UserProfileView.tsx`

1. **Replace import**: Change from `FocusedFlowLayout` to `AppLayout`
   - Remove: `import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";`
   - Add: `import { AppLayout } from "@/components/layout/AppLayout";`

2. **Remove custom headerContent definition** (lines 75-91)
   - We'll create an inline sub-header instead

3. **Replace layout wrapper**: Change from `FocusedFlowLayout` to `AppLayout`
   - Remove `headerContent` and `showBottomNav` props
   - Keep `footerContent` as a sticky footer at bottom of content

4. **Add sub-header inside content**: Add the back button + "Profile" title as a sub-header within the scrollable content area

5. **Fix footer positioning**: Move the "Message" button footer to be part of the content flow or use a different approach since AppLayout doesn't have a footer slot

---

### Before/After

**Before:**
- No global header (logo, notifications, menu missing)
- Only custom "Profile" header with back button
- Uses `FocusedFlowLayout`

**After:**
- Global header visible at top (Ketravelan logo + notifications + menu)
- Sub-header below with back arrow + "Profile" title  
- Bottom navigation visible
- Uses `AppLayout`

---

### Visual Result
The page will have:
1. Global header (Ketravelan logo + notifications + menu) at the top
2. Profile sub-header with back arrow + "Profile" title
3. Cover photo, avatar, profile content
4. "Message" button (sticky at bottom)
5. Bottom navigation bar

---

### Technical Approach

The structure will be:
```tsx
<AppLayout>
  {/* Sub-header */}
  <div className="-mx-4 -mt-4 mb-4 glass border-b border-border/50">
    <div className="flex items-center gap-3 h-14 px-3">
      <Button onClick={() => navigate(-1)}>
        <ChevronLeft />
      </Button>
      <h1>Profile</h1>
    </div>
  </div>
  
  {/* Cover photo + profile content */}
  ...
  
  {/* Sticky footer with Message button */}
  <div className="sticky bottom-16">
    <Button>Message {name}</Button>
  </div>
</AppLayout>
```
