

## Create Edit Trip Details & Trip Settings Pages

### Overview
Two new organizer-only pages accessible from the Trip Drawer's "Manage Trip" section. Both use `FocusedFlowLayout` with sticky headers and follow existing Ketravelan design patterns.

---

### File Changes

#### 1. New: `src/pages/EditTripDetails.tsx`

**Layout**: `FocusedFlowLayout` with header (back button + "Edit Trip" title + ghost Save button) and sticky bottom CTA.

**Sections** (scrollable form, pre-populated from mock trip data):
- **Trip Cover** -- Current trip image with floating Camera icon overlay (upload placeholder via toast)
- **Basic Info** -- Trip Name (Input, required), Country (Input, required), City (Input, optional), Start Date + End Date (date pickers using Popover + Calendar)
- **Trip Type** -- Public/Private toggle using Switch component, with description text
- **Capacity** -- Max participants (Input type=number), current count shown as read-only muted text
- **Travel Style** -- Reuse `TravelStylePills` from explore or `TravelStyleGrid` from onboarding with `tripCategories` data. Multi-select pills matching existing pattern
- **Description** -- Textarea with placeholder "Tell people what this trip is about..."
- **What to Expect** -- Reuse `RequirementsSection` component from create-trip (already handles emoji chips + custom input)

**Bottom sticky CTA**: "Save Changes" button, full-width primary, disabled until form state differs from initial. On save: toast success + navigate back.

**Unsaved changes guard**: Track dirty state via comparison. On back button press when dirty, show AlertDialog: "Discard changes?" with Cancel/Discard options.

**Access control**: Compare `currentUserId` ("1") against `mockMembers`. If not organizer, redirect to `/trip/:id/hub`.

#### 2. New: `src/pages/TripSettings.tsx`

**Layout**: `FocusedFlowLayout` with header (back button + "Trip Settings" title).

**Sections**:
- **Privacy & Visibility** -- Switch or SegmentedControl for Public/Private with description text
- **Permissions** -- Two select dropdowns: "Who can edit trip details" (Only Organizer / Everyone), "Who can add expenses" (Everyone / Organizer Only)
- **Members shortcut** -- Card row: "Manage Members" with ChevronRight, navigates to `/trip/:id/hub` and opens drawer
- **Notifications** -- Three Switch toggles: New members join, Expense updates, Chat activity
- **Danger Zone** -- Red-bordered card section:
  - "Leave Trip" button (outline, destructive) -- shows toast "Transfer ownership first" for organizer
  - "Delete Trip" button (destructive) -- AlertDialog confirmation: "This action cannot be undone. All trip data will be permanently deleted." with Cancel/Delete

**Access control**: Same organizer check as Edit page.

#### 3. Update: `src/App.tsx`

Add two routes:
```
<Route path="/trip/:id/edit" element={<EditTripDetails />} />
<Route path="/trip/:id/settings" element={<TripSettings />} />
```

#### 4. Update: `src/components/trip-hub/GroupInfoModal.tsx`

- Change `handleEditDetails` to navigate to `/trip/${trip.id}/edit` instead of `/create-trip?edit=${trip.id}`
- Change `handleTripSettings` to navigate to `/trip/${trip.id}/settings` instead of showing a toast

### Components Reused
- `FocusedFlowLayout` (page shell)
- `Input`, `Textarea`, `Switch`, `Button`, `Calendar`, `Popover` (shadcn)
- `AlertDialog` (discard/delete confirmations)
- `RequirementsSection` (What to Expect chips)
- `tripCategories` from `@/data/categories` (travel style pills)
- `getExpectationEmoji` from `@/lib/expectationUtils` (emoji matching)
- `mockTrips`, `mockMembers` from `@/data/mockData`

### Data Flow
- Both pages load trip data from `mockTrips` using URL param `:id`
- Form state is local `useState` -- no persistence beyond toast confirmation (mock-only)
- Organizer check uses hardcoded `currentUserId = "1"` matching `mockMembers`

