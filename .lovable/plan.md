

## Welcome Onboarding: Add 3 New Expense Feature Slides

### Overview
Add 3 new expense-focused slides to the welcome onboarding flow, positioned after the existing "Track Group Expenses" slide and before the "Travel Buddies" slide. This expands the carousel from 3 slides to 6 slides.

---

### New Slide Order

| Position | Slide Title | Status |
|----------|-------------|--------|
| 1 | Intro (Travel Together. Split Costs.) | Existing |
| 2 | Track Group Expenses — Fairly and Instantly | Existing |
| 3 | **Expenses at a Glance** | NEW |
| 4 | **Upfront Payments, Tracked** | NEW |
| 5 | **Net Settlement, Simplified** | NEW |
| 6 | Plan Trips or Find Travel Buddies | Existing (moved) |

---

### New Slide Designs (Based on Reference Images)

#### Screen 3: Expenses at a Glance

```text
┌─────────────────────────────────────┐
│  📋 Your Total Expenses             │
│  RM 680                             │
│  Your share of all trip costs       │
├─────────────────┬───────────────────┤
│ ↗ You're Owed   │ ↘ You Owe         │
│ RM 85           │ RM 120            │
│ Net from others │ Net to others     │
└─────────────────┴───────────────────┘

Expenses at a Glance

See your total spend, what you owe, and
what others owe you.

        [ Next ]
```

#### Screen 4: Upfront Payments, Tracked

```text
┌─────────────────────────────────────┐
│  Paid on Behalf of the Group        │
│  Total: RM 2,530          Avg: RM 633│
├─────────────────────────────────────┤
│ AR  Ahmad Razak    RM 1,200 (47%)   │
│ ████████████████████░░░░░           │
│ ST  Sarah Tan      RM 770 (30%)     │
│ ███████████░░░░░░░░░░░░░░           │
│ LW  Lisa Wong      RM 380 (15%)     │
│ █████░░░░░░░░░░░░░░░░░░░░           │
│ ML  Marcus Lee     RM 180 (8%)      │
│ ██░░░░░░░░░░░░░░░░░░░░░░░           │
└─────────────────────────────────────┘

Upfront Payments, Tracked

Instantly track who paid upfront and
manage shared costs fairly.

        [ Next ]
```

#### Screen 5: Net Settlement, Simplified

```text
┌─────────────────────────────────────┐
│         RM 256.00                   │
│    Net amount to be settled         │
│  This is the final amount after     │
│  offsetting shared expenses.        │
├─────────────────────────────────────┤
│ View breakdown                   ▼  │
├─────────────────────────────────────┤
│ JOHN OWES AHMAD                     │
│ • Accommodation - 3 nights  RM 300.00│
│ LESS: AHMAD OWES JOHN               │
│ • Sky Bridge tickets       -RM 44.00│
├─────────────────────────────────────┤
│ Net total                  RM 256.00│
└─────────────────────────────────────┘

Net Settlement, Simplified

We offset expenses automatically —
no mental maths, no confusion.

        [ Next ]
```

---

### Technical Changes

#### File: `src/pages/WelcomeOnboarding.tsx`

1. **Update `handleNext` function**
   - Change condition from `currentSlide < 2` to `currentSlide < 5` (since we now have 6 slides, indices 0-5)

2. **Update `ProgressDots` total**
   - Change `total={3}` to `total={6}`

3. **Add 3 new slide components** after existing Screen 2:

   **Screen 3: Expenses at a Glance**
   - Card with "Your Total Expenses" header and icon
   - Large amount display (RM 680)
   - Two-column layout: "You're Owed" and "You Owe" boxes
   - Title: "Expenses at a Glance"
   - Subtitle: "See your total spend, what you owe, and what others owe you."
   - Next button

   **Screen 4: Upfront Payments, Tracked**
   - Card with "Paid on Behalf of the Group" header
   - Total/Average summary row
   - List of 4 members with:
     - Avatar initials with unique colors
     - Name
     - Amount paid with percentage
     - Colored progress bar
   - Title: "Upfront Payments, Tracked"
   - Subtitle: "Instantly track who paid upfront and manage shared costs fairly."
   - Next button

   **Screen 5: Net Settlement, Simplified**
   - Card with large net amount (RM 256.00)
   - "Net amount to be settled" subtitle
   - Expandable "View breakdown" section showing:
     - Who owes whom
     - Item details with amounts
     - Less: offsetting amounts (negative, in red/orange)
     - Net total
   - Title: "Net Settlement, Simplified"
   - Subtitle: "We offset expenses automatically — no mental maths, no confusion."
   - Next button

4. **Move existing Screen 3 (Travel Buddies)** to position 6
   - This becomes the final slide with "Get Started" button

---

### Mock Data for New Slides

**Screen 4 - Member Payment Data:**
```text
[
  { initials: "AR", name: "Ahmad Razak", amount: 1200, percent: 47, color: "bg-cyan-500" },
  { initials: "ST", name: "Sarah Tan", amount: 770, percent: 30, color: "bg-orange-400" },
  { initials: "LW", name: "Lisa Wong", amount: 380, percent: 15, color: "bg-purple-500" },
  { initials: "ML", name: "Marcus Lee", amount: 180, percent: 8, color: "bg-blue-500" }
]
```

---

### Visual Consistency
- All new slides follow the existing pattern:
  - Card mockup at top (with subtle backdrop blur)
  - Bold title below
  - Muted subtitle text
  - Full-width button at bottom
- Progress dots will show 6 dots instead of 3
- Currency shown as RM (Malaysian Ringgit) to match reference images

