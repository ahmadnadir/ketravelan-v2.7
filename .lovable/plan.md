

## Story Detail Page Enhancement Plan

### Overview
This plan addresses three key requirements for the Story Detail page:
1. Make the top navbar visible (show the app header with logo, notifications, menu)
2. Make the Like, Save, and Share buttons functional
3. Replace "Discuss This Story" section with a "Leave a Comment" section with a proper comment input

---

### Current Issues (Image 1: Story Detail Page)

| Issue | Current State | Required |
|-------|--------------|----------|
| Top navbar | Hidden (`hideHeader` prop) | Visible (standard app header) |
| Like button | Non-functional, static | Functional (toggle like state) |
| Save button | Non-functional, static | Functional (toggle save state) |
| Share button | Non-functional | Functional (Web Share API) |
| Bottom CTA | "Discuss This Story" | "Leave a Comment" with input field |

---

### Changes Required

#### 1. Show Top Navbar
**File:** `src/pages/StoryDetail.tsx`

Remove the `hideHeader` prop from `AppLayout`:
- **Before:** `<AppLayout hideHeader>`
- **After:** `<AppLayout>`

This will show the standard app header with logo, notifications, and menu icons.

---

#### 2. Make Like/Save/Share Buttons Functional

**Approach:** Use the existing `CommunityContext` which already has `toggleStoryLike` and `toggleStorySave` functions.

**Changes:**
- Wrap `StoryDetail` page content with `CommunityProvider`
- Use `useCommunity` hook to access toggle functions
- Get the story from context (to reflect real-time like/save state)
- Implement Web Share API for the Share button

**Like Button:**
```text
- On click: Call toggleStoryLike(story.id)
- Visual: Show filled heart when isLiked = true
- Count: Update dynamically
```

**Save Button:**
```text
- On click: Call toggleStorySave(story.id)
- Visual: Show filled bookmark when isSaved = true
- Count: Update dynamically
```

**Share Button:**
```text
- On click: Use navigator.share() if available
- Fallback: Copy URL to clipboard with toast notification
```

---

#### 3. Replace "Discuss This Story" with Comment Section

**Current (line 133-141):**
```text
Box with "Discuss This Story" button
```

**New Design (matching Discussion Detail - Image 2):**

```text
┌──────────────────────────────────────────────┐
│  Comments (X)                                │
├──────────────────────────────────────────────┤
│  [Avatar] User Name                          │
│  about 1 year ago                            │
│  Comment content here...                     │
├──────────────────────────────────────────────┤
│  [Avatar] Another User                       │
│  2 days ago                                  │
│  Another comment...                          │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────┐  ┌──────┐   │
│  │ Write a comment...         │  │  ➤   │   │
│  └────────────────────────────┘  └──────┘   │
└──────────────────────────────────────────────┘
```

**Mock Comments Data:**
- Will add mock comments array similar to `mockReplies` in DiscussionDetail
- Display with avatar, name, timestamp, and content

**Comment Input:**
- Text input with placeholder "Write a comment..."
- Send button (only enabled when text is entered)
- Only visible for authenticated users

---

### Technical Implementation

**File:** `src/pages/StoryDetail.tsx`

1. **Add imports:**
   - `useState` from React
   - `CommunityProvider`, `useCommunity` from CommunityContext
   - `useAuth` from AuthContext
   - `Input` from UI components
   - `Send` icon from lucide-react
   - `toast` from sonner

2. **Add mock comments data** (at top of file):
   ```text
   Array of comment objects with:
   - id, author (name, avatar), content, createdAt
   ```

3. **Wrap with CommunityProvider** and create inner component to use hooks

4. **Get story from context** instead of mock data to ensure reactivity

5. **Update Like button:**
   - Add onClick handler calling toggleStoryLike
   - Add conditional styling for isLiked state
   - Add fill class when liked

6. **Update Save button:**
   - Add onClick handler calling toggleStorySave
   - Add conditional styling for isSaved state
   - Add fill class when saved

7. **Update Share button:**
   - Add async onClick handler
   - Try navigator.share() with title, text, url
   - Fallback to clipboard copy with toast

8. **Replace "Discuss This Story" section:**
   - Change header text to "Leave a Comment"
   - Map through mock comments
   - Add comment input with send button (auth-gated)

---

### Dependencies
- Uses existing `CommunityContext` (no new context needed)
- Uses existing `useAuth` hook for authentication check
- Uses existing UI components (Input, Button, Avatar)
- Uses existing `toast` from sonner for feedback

