

## Replace Last Slide Buttons with Side-by-Side Log In / Sign Up

### Change
In `src/pages/WelcomeOnboarding.tsx`, replace the "Get Started" and "Skip for Now" buttons on the last slide (Screen 6) with two side-by-side black filled buttons: "Log In" and "Sign Up".

### What's Removed
- "Get Started" primary button
- "Skip for Now" ghost button

### What's Added
- A `flex gap-3` row with two buttons:
  - **Log In** -- calls `handleLogin()`
  - **Sign Up** -- calls `handleSignUp()`
- Both use `variant="default"` (primary black filled), `flex-1` for equal width, same `h-12 text-base font-medium rounded-xl` styling

### File
- `src/pages/WelcomeOnboarding.tsx` -- the button section in Screen 6 (last slide, around lines 215-225)

