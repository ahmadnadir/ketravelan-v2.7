

## Fix Back Navigation: Edit Details & Trip Settings → Reopen Group Info Drawer

### Problem
When navigating back from Edit Trip Details or Trip Settings, the user lands on the Trip Hub chat view instead of returning to the Group Info drawer they came from.

### Solution
Use React Router's `location.state` to pass a flag that tells TripHub to auto-open the drawer on mount.

### Changes

**1. `src/pages/TripHub.tsx`**
- Import `useLocation`
- Read `location.state?.openGroupInfo` and if truthy, set `groupInfoOpen` to `true` on mount

**2. `src/pages/EditTripDetails.tsx`**
- Replace all `navigate(-1)` calls (lines 94, 100, 334) with `navigate(`/trip/${id}/hub`, { state: { openGroupInfo: true } })`

**3. `src/pages/TripSettings.tsx`**
- Replace `navigate(-1)` (line 58) with `navigate(`/trip/${id}/hub`, { state: { openGroupInfo: true } })`
- Update `handleManageMembers` (line 37) similarly with the state flag

