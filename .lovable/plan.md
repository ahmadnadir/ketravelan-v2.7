

## Trip Control Panel Enhancement

### Overview
Transform the existing `GroupInfoModal` (bottom sheet) into a role-aware "Trip Control Panel". The current user is simulated as member ID "1" (Ahmad Razak, role: "Organizer"). Regular members see the current clean view; organizers get additional management sections.

### Architecture

**Role detection**: Compare current user ID against member list. Member with `role: "Organizer"` gets elevated UI. For now, hardcode current user as ID "1" (the organizer in mock data). Add `currentUserId` prop to `GroupInfoModal`.

### Changes to `src/components/trip-hub/GroupInfoModal.tsx`

**1. Header changes (organizer only)**
- Remove inline title editing (tap-to-edit). Title becomes read-only display for everyone.
- Add a small ghost "Edit" button (Pencil icon) next to the title -- visible only for organizers. Clicking navigates to `/create-trip?edit={tripId}` (or shows a toast placeholder).
- Camera button on trip image: visible only for organizers.

**2. New "Manage Trip" section (organizer only)**
- Inserted between header and members list.
- Three list-style buttons with lucide icons:
  - `Pencil` **Edit Details** -- navigates to edit page
  - `Users` **Manage Members** -- scrolls to members section
  - `Settings` **Trip Settings** -- opens toast placeholder (future settings modal)
- Styled as a simple card with divided rows, matching existing design language.

**3. Members section enhancements**
- **Organizer view**: Each member row (except self) gets a kebab menu (`MoreVertical` icon) replacing/alongside the message button. Dropdown menu options:
  - "Message" -- existing DM navigation
  - "Promote to Organizer" -- toast placeholder
  - "Remove from Trip" -- toast placeholder with destructive styling
- **Member view**: Unchanged -- avatar, name, role, message button only.

**4. "Invite Members" CTA**
- At the bottom of the members list.
- `UserPlus` icon + "Invite Members" text.
- Ghost/outline button style, full width.
- Visible to organizers only.
- Click shows toast placeholder.

### Props changes
- Add `currentUserId?: string` prop (default: "1")
- Derive `isOrganizer` from matching current user's role in members array

### New dependencies
- `MoreVertical`, `Pencil`, `Users`, `Settings`, `UserPlus`, `Share` from lucide-react
- `DropdownMenu` components (already in project)
- `toast` from sonner (already in project)

### Files
- **Edit**: `src/components/trip-hub/GroupInfoModal.tsx` -- all changes above (~120 lines rewritten)
- **Edit**: `src/pages/TripHub.tsx` -- pass `currentUserId="1"` to `GroupInfoModal`

