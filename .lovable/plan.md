

## Fix: Back Navigation from Story Detail to Stories Tab

### Problem
When clicking the back button on a Story Detail page, the user is directed to the Community page but lands on the "Discussions" tab instead of the "Stories" tab. This happens because:

1. The back button in `StoryDetail.tsx` links to `/community` without any tab indicator
2. The `Community.tsx` page has a `useEffect` that sets the default mode to "discussions" for authenticated users on every mount
3. This overrides the expected behavior of returning to the Stories tab

### Solution
Pass a query parameter or state to indicate which tab to show when navigating back from a story.

---

### Changes Required

#### 1. Update `src/pages/StoryDetail.tsx`

Change the back button link from:
```tsx
<Link to="/community" ... >
```

To:
```tsx
<Link to="/community?tab=stories" ... >
```

Also update the "Back to Community" button in the "story not found" state.

---

#### 2. Update `src/pages/Community.tsx`

Read the `tab` query parameter from the URL and use it to set the initial mode:

```tsx
import { useSearchParams } from "react-router-dom";

function CommunityContent() {
  const [searchParams] = useSearchParams();
  const { mode, setMode } = useCommunity();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for tab query parameter first
    const tabParam = searchParams.get("tab");
    if (tabParam === "stories" || tabParam === "discussions") {
      setMode(tabParam);
    } else {
      // Default behavior: authenticated users see discussions, others see stories
      setMode(isAuthenticated ? "discussions" : "stories");
    }
  }, []);
}
```

---

### How It Works

| Scenario | URL | Result |
|----------|-----|--------|
| Back from story detail | `/community?tab=stories` | Opens Stories tab |
| Back from discussion detail | `/community?tab=discussions` | Opens Discussions tab |
| Direct navigation | `/community` | Default (authenticated: discussions, guest: stories) |
| Bottom nav click | `/community` | Default behavior preserved |

---

### Files to Modify

| File | Change |
|------|--------|
| `src/pages/StoryDetail.tsx` | Add `?tab=stories` to back button links |
| `src/pages/Community.tsx` | Read `tab` query param and set mode accordingly |

