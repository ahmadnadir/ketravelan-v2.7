

## Reddit-Style Discussion Detail Redesign

This plan replaces the "Answered/Accepted" system with a Reddit-style upvote/downvote interaction model, improves reply readability, and adds sorting -- all while keeping the UI clean and aligned with the Ketravelan design system.

---

### What Changes

**1. Remove all green "Answered" and "Accepted" UI**

- **DiscussionDetail.tsx**: Remove the green "Answered" badge from the discussion header and the green "Accepted" badge + green highlight styling from reply cards.
- **DiscussionCard.tsx**: Remove the green "Answered" badge from the card in the discussions feed list.
- All reply cards will use the same neutral `bg-secondary/50` background -- no special green borders or backgrounds.

**2. Add upvote/downvote voting on each reply**

Each reply card gets a compact vote column on the left side:
- `ChevronUp` icon (upvote)
- Numeric score in the middle
- `ChevronDown` icon (downvote)

Interaction logic (client-side state):
- Clicking upvote toggles it on/off; clicking downvote toggles it on/off.
- A user cannot have both active simultaneously (clicking one clears the other).
- Active vote icon uses the primary/foreground color; inactive uses muted color.
- Mock replies will get an initial `score` field (e.g., 12, 5).

**3. Add sort control above the replies list**

A segmented control or pill group above replies with three options:
- **Top** (default) -- sort by score descending
- **Newest** -- sort by createdAt descending
- **Oldest** -- sort by createdAt ascending

Uses the existing `SegmentedControl` component already in the codebase.

**4. Update discussion header metadata**

Replace the "Answered" badge area with a compact stats row showing:
- Reply count (e.g., "2 replies")
- Views placeholder (e.g., "1.2k views")

Keep the location and topic pills as neutral badges (already styled correctly).

**5. Add action row below each reply**

Below each reply's body text, add a small muted action row:
- Reply (placeholder) · Share (placeholder) · Report (placeholder)
- These are non-functional text buttons for now, styled as `text-xs text-muted-foreground`.

**6. Ensure reply composer doesn't overlap content**

Add bottom padding to the replies list container so the sticky reply input doesn't cover the last reply.

---

### Technical Details

**Files to modify:**

| File | Changes |
|------|---------|
| `src/pages/DiscussionDetail.tsx` | Major rewrite: remove Answered/Accepted UI, add vote state, sort state, new reply card layout with vote column and action row, sort control, stats row, bottom padding |
| `src/components/community/discussions/DiscussionCard.tsx` | Remove the green "Answered" badge and `CheckCircle2` import |
| `src/data/communityMockData.ts` | Remove `isAnswered` from the `Discussion` type (optional -- can also just stop using it) |

**New state in DiscussionDetail.tsx:**
- `votes`: `Record<string, "up" | "down" | null>` -- tracks user's vote per reply
- `sortBy`: `"top" | "newest" | "oldest"` -- current sort mode
- Mock replies updated to include a `score` field

**Vote logic:**
```text
handleVote(replyId, direction):
  if current vote === direction -> set to null (toggle off), adjust score
  else -> set to direction (toggle on, clear opposite), adjust score
```

**Reply card layout (mobile-friendly):**
```text
+--------------------------------------+
| [ChevronUp]   Avatar  Name    · 1y   |
|   12          Reply body text here... |
| [ChevronDown]                         |
|              Reply · Share · Report   |
+--------------------------------------+
```

The vote controls will be a narrow column on the left (~32px), keeping the layout compact on mobile.

**Sort control** will use the existing `SegmentedControl` component placed between the reply count header and the reply list.

