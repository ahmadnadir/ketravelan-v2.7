

## Change Icons to Emoji Style on Story Setup

### What You Want
Switch from Lucide icons to emoji icons in the Story Setup page to match the style used in Create Trip and Filter screens (as shown in your reference image).

### Current State
- **Story Type** section uses Lucide icons (`Map`, `Lightbulb`, `Compass`, etc.)
- **Travel Style** section uses Lucide icons (`Leaf`, `Mountain`, `Waves`, etc.)

### Target State
- Use emoji icons instead (like 🌿, 🏖️, 🏙️) to match the system style from Create Trip/Filter

---

### Technical Changes

#### 1. Update Story Type Options (communityMockData.ts)

Change the `icon` field from Lucide icon names to emoji strings:

| Type | Label | Current Icon | New Emoji |
|------|-------|--------------|-----------|
| trip-recap | Trip Recap | Map | 🗺️ |
| lessons-learned | Lessons Learned | Lightbulb | 💡 |
| tips-for-others | Tips for Others | MessageCircle | 💬 |
| destination-guide | Destination Guide | Compass | 🧭 |
| budget-breakdown | Budget Breakdown | Wallet | 💰 |
| solo-travel | Solo Travel | User | 🧳 |
| first-time-experience | First-Time Experience | Sparkles | ✨ |

#### 2. Update Travel Style Options (communityMockData.ts)

Change to emojis matching the system categories:

| ID | Label | Current Icon | New Emoji |
|----|-------|--------------|-----------|
| nature-outdoor | Nature & Outdoor | Leaf | 🌿 |
| adventure | Adventure | Mountain | 🧗 |
| beach | Beach | Waves | 🏖️ |
| food | Food & Culinary | Utensils | 🍜 |
| city-urban | City & Urban | Building2 | 🏙️ |
| culture | Culture | Landmark | 🏛️ |
| hiking | Hiking | Footprints | 🥾 |
| photography | Photography | Camera | 📸 |
| backpacking | Backpacking | Backpack | 🎒 |
| budget | Budget-friendly | BadgeDollarSign | 💵 |

#### 3. Update StorySetupStep.tsx

Remove the Lucide icon imports and icon maps, render emojis directly as strings:

```tsx
// Before (Lucide icon)
{Icon && <Icon className="h-4 w-4" />}

// After (Emoji)
<span>{option.icon}</span>
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/data/communityMockData.ts` | Update `storyFocusOptions` and `travelStyleOptions` to use emoji strings |
| `src/components/story-builder/StorySetupStep.tsx` | Remove Lucide icon imports and maps; render emoji directly as `<span>` |

---

### Visual Result

The pills will look like the reference image:
- 🌿 Nature & Outdoor
- 🏖️ Beach  
- 🏙️ City & Urban
- 🧗 Adventure
- 🏛️ Culture
- 🍜 Food

Instead of the current Lucide icon style.

