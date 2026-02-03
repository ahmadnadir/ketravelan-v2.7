

## Plan: Create "My Stories" Page for User Content Management

This plan creates a new page called "My Stories" accessible from the menu drawer. It will allow users to manage their published stories, drafts, liked stories, and saved stories.

---

### Overview

| Tab | Description | Data Source |
|-----|-------------|-------------|
| Published | Stories authored by the current user | Filter stories by `author.id === "current-user"` |
| Drafts | Unpublished story drafts for editing | localStorage via `useStoryDraft` hook |
| Liked | Stories the user has liked | Filter stories by `isLiked === true` |
| Saved | Stories the user has bookmarked | Filter stories by `isSaved === true` |

---

### Changes

#### 1. Create New Page: `src/pages/MyStories.tsx`

The page will use the same layout patterns as `MyTrips.tsx` with:

- `AppLayout` for consistent navigation
- `SegmentedControl` with 4 tabs (Published, Drafts, Liked, Saved)
- Empty states with appropriate icons
- Skeleton loading state
- Reuse `StoryCard` component for displaying stories

```text
+------------------------------------------+
|           My Stories & Discussions       |
+------------------------------------------+
| [Published] [Drafts] [Liked] [Saved]     |
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  | Story Card                         |  |
|  | Cover image, title, excerpt...     |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | Story Card                         |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

#### 2. Update Menu Drawer: `src/components/layout/MenuDrawer.tsx`

Add new menu item with a `BookOpen` icon:

```tsx
{ icon: BookOpen, label: "My Stories", path: "/my-stories" }
```

Position it after "My Trips" for logical grouping of user content.

#### 3. Add Route: `src/App.tsx`

Register the new route:

```tsx
<Route path="/my-stories" element={<MyStories />} />
```

---

### Technical Details

#### Data Sources

**Published Stories**
```tsx
const { stories } = useCommunity();
const publishedStories = stories.filter(s => s.author.id === "current-user");
```

**Draft Stories**
```tsx
const { draft, hasDraft } = useStoryDraft();
// Display single draft card if hasDraft is true
```

**Liked Stories**
```tsx
const likedStories = stories.filter(s => s.isLiked);
```

**Saved Stories**
```tsx
const savedStories = stories.filter(s => s.isSaved);
```

#### Empty States

| Tab | Icon | Message |
|-----|------|---------|
| Published | `PenLine` | "No published stories yet. Share your first travel story!" |
| Drafts | `FileEdit` | "No drafts. Start writing a new story!" |
| Liked | `Heart` | "No liked stories yet. Explore the community!" |
| Saved | `Bookmark` | "No saved stories. Bookmark stories to read later!" |

#### Draft Card Component

Since drafts are not full Story objects, create a simplified card that shows:
- Cover image (if set) or placeholder
- Title
- Last saved date
- "Continue Editing" CTA button that navigates to `/create-story`

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/MyStories.tsx` | Create new page |
| `src/components/layout/MenuDrawer.tsx` | Add menu item |
| `src/App.tsx` | Add route |

