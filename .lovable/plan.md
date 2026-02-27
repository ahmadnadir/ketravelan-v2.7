

## Rearrange Welcome Onboarding Buttons

### Change
In `src/pages/WelcomeOnboarding.tsx`, update the first slide's button section (around lines 95-115):

**Current layout:**
```
[Explore Features]   (primary, full width)
[Log In]             (secondary, full width)
[Sign Up]            (outline, full width)
```

**New layout:**
```
[Explore Features]          (primary, full width)
[Log In]  [Sign Up]         (both outline, side-by-side, equal width)
```

### Technical Details
- Replace the `space-y-3` container with: `Explore Features` button followed by a `flex gap-3` row containing `Log In` and `Sign Up`, both using `variant="outline"` and `flex-1` for equal width.
- Change `Log In` from `variant="secondary"` to `variant="outline"` so both buttons match.
- Both buttons keep the same `h-12 text-base font-medium rounded-xl` styling.

### File
- `src/pages/WelcomeOnboarding.tsx` -- lines ~97-115 (button group in Screen 1)

