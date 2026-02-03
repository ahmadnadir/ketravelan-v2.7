
## Fix: Story Not Found After Publishing

### Problem Analysis

The "Story not found" error occurs because **each page creates its own isolated `CommunityProvider`** with separate state:

```text
┌─────────────────────────────────────────────────────────────┐
│  CreateStory Page                                           │
│  └── CommunityProvider (Instance A)                         │
│       └── publishes story → state updated                   │
│           └── useEffect saves to localStorage               │
│           └── navigate to /community/stories/{slug}         │
└─────────────────────────────────────────────────────────────┘
                            ↓ (navigation)
┌─────────────────────────────────────────────────────────────┐
│  StoryDetail Page                                           │
│  └── CommunityProvider (Instance B) ← NEW instance!         │
│       └── loads from localStorage                           │
│       └── story NOT found (race condition or timing)        │
└─────────────────────────────────────────────────────────────┘
```

**Two issues:**
1. Each provider has independent state - they don't share the published story
2. localStorage save may not complete before navigation

---

### Solution: Global CommunityProvider at App Level

Move `CommunityProvider` to the app root so all community-related pages share the same state.

---

### Implementation Steps

#### Step 1: Add CommunityProvider to App.tsx

Wrap the entire app (or at minimum the Routes) with a single `CommunityProvider`:

```tsx
// App.tsx
import { CommunityProvider } from "./contexts/CommunityContext";

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ExpenseProvider>
        <ApprovalsProvider>
          <CommunityProvider>  {/* Add here */}
            <TooltipProvider>
              {/* ... existing content ... */}
            </TooltipProvider>
          </CommunityProvider>
        </ApprovalsProvider>
      </ExpenseProvider>
    </QueryClientProvider>
  </AuthProvider>
);
```

#### Step 2: Remove Duplicate Providers from Pages

Remove the local `CommunityProvider` wrapper from:

| File | Change |
|------|--------|
| `src/pages/CreateStory.tsx` | Remove `<CommunityProvider>` wrapper, just export `CreateStoryContent` as default |
| `src/pages/StoryDetail.tsx` | Remove `<CommunityProvider>` wrapper, just use `AppLayout` directly |
| `src/pages/Community.tsx` | Remove `<CommunityProvider>` wrapper |

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Import and wrap routes with `CommunityProvider` |
| `src/pages/CreateStory.tsx` | Remove local provider wrapper |
| `src/pages/StoryDetail.tsx` | Remove local provider wrapper |
| `src/pages/Community.tsx` | Remove local provider wrapper |

---

### Why This Works

- **Single source of truth**: All pages read from the same provider state
- **Immediate availability**: When `publishStory` is called, the story is added to state that all pages share
- **No race condition**: Navigation to StoryDetail will find the story in the shared state
- **localStorage still works**: For persistence across page refreshes, the shared provider handles loading/saving

---

### Technical Notes

The CommunityProvider is lightweight (just holds stories/discussions in memory + localStorage sync) so placing it at the app level has minimal performance impact. This follows the same pattern already used for `AuthProvider`, `ExpenseProvider`, and `ApprovalsProvider`.
