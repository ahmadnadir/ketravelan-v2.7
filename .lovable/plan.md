

## Head-Level SEO Enhancement for Trip Details Page

Zero visual changes. All modifications are in `<head>` metadata, JSON-LD structured data, canonical URLs, and image alt attributes only.

---

### What's Currently Working
- SEOHead renders dynamic title, description, OG tags, Twitter cards
- TripSchema outputs TouristTrip JSON-LD
- BreadcrumbSchema outputs BreadcrumbList JSON-LD
- Canonical URL and noIndex for private trips

### What's Missing or Broken
1. No explicit `index, follow` robots tag for public trips
2. Canonical URL uses `window.location.origin` instead of fixed `SITE_URL`
3. Breadcrumb URLs also use `window.location.origin`
4. No Organization schema (site-wide)
5. No Event schema for fixed-date trips
6. No FAQPage schema (invisible -- JSON-LD only, no visible section)
7. TripSchema uses `itinerary` field incorrectly (should be destination/Place under a different property)
8. Gallery image alt text is generic (just trip title, thumbnails have no descriptive alt)

---

### Changes by File

#### 1. `src/components/seo/SEOHead.tsx`
- Add `<meta name="robots" content="index, follow" />` when `noIndex` is false
- No other changes (everything else is correct)

#### 2. `src/components/seo/TripSchema.tsx`
- Fix destination: use `touristDestination` instead of `itinerary` for the Place object (per schema.org TouristTrip spec)
- Add conditional Event schema: when `startDate` AND `endDate` are present AND `visibility` is `'public'`, output a second JSON-LD block with `@type: Event`
  - Includes: name, description, startDate, endDate, location (Place), offers, organizer, eventStatus, eventAttendanceMode
- Add new prop: `visibility?: 'public' | 'private'`
- Add optional `geo` prop for coordinates (future-ready, not used yet)

#### 3. New file: `src/components/seo/OrganizationSchema.tsx`
- Renders a single `<script type="application/ld+json">` with Organization schema for Ketravelan
- Fields: name, url, logo, description
- No visible output

#### 4. New file: `src/components/seo/FAQSchema.tsx`
- Accepts `Array<{question: string, answer: string}>`
- Renders FAQPage JSON-LD in `<head>` only
- No visible output whatsoever

#### 5. `src/pages/TripDetails.tsx`
**Head/metadata fixes (no UI changes):**
- Replace `window.location.origin` with imported `SITE_URL` from `src/lib/seo.ts` for canonical URL and breadcrumb URLs (line 341 and lines 373-378)
- Add `<OrganizationSchema />` alongside existing SEO components
- Add `<FAQSchema />` with contextual Q&A generated from trip data:
  - "How do I join this trip?" / "What's included in the budget?" / "When does this trip start?" / "Who organizes this trip?"
  - Answers derived from tripData fields
- Pass `visibility` prop to `TripSchema`

**Image alt text improvements (no layout change):**
- Main gallery image (line 447): change `alt={tripData.title}` to `alt={`${tripData.title} - ${tripData.destination} photo ${currentImage + 1} of ${images.length}`}`
- Thumbnail buttons (around line 500): add descriptive alt to thumbnail images

#### 6. `src/lib/seo.ts`
- Export `SITE_URL` constant (currently defined but not exported with `export` keyword -- needs to add export)

---

### Files Summary

| File | Action | UI Impact |
|------|--------|-----------|
| `src/components/seo/SEOHead.tsx` | Add explicit index/follow | None |
| `src/components/seo/TripSchema.tsx` | Fix destination field, add Event schema | None |
| `src/components/seo/OrganizationSchema.tsx` | New file -- Organization JSON-LD | None |
| `src/components/seo/FAQSchema.tsx` | New file -- FAQPage JSON-LD | None |
| `src/pages/TripDetails.tsx` | Use SITE_URL, add schemas, fix alt text | None (alt text is invisible) |
| `src/lib/seo.ts` | Export SITE_URL | None |

### Example Rendered Head Output (Sample Trip)

```text
<title>Langkawi Island Adventure - Langkawi, Malaysia | Ketravelan</title>
<meta name="description" content="Join this Outdoor & Beach group trip to Langkawi, Malaysia. From RM 650. 4 spots left." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://ketravelan.com/trips/langkawi-malaysia-langkawi-island-adventure-1" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Langkawi Island Adventure - Langkawi, Malaysia | Ketravelan" />
<meta property="og:image" content="https://images.unsplash.com/..." />
<meta name="twitter:card" content="summary_large_image" />

<script type="application/ld+json">
  { "@type": "TouristTrip", "name": "Langkawi Island Adventure", "touristDestination": { "@type": "Place", ... }, ... }
</script>
<script type="application/ld+json">
  { "@type": "Event", "name": "Langkawi Island Adventure", "startDate": "2025-04-15", ... }
</script>
<script type="application/ld+json">
  { "@type": "BreadcrumbList", ... }
</script>
<script type="application/ld+json">
  { "@type": "Organization", "name": "Ketravelan", ... }
</script>
<script type="application/ld+json">
  { "@type": "FAQPage", "mainEntity": [ ... ] }
</script>
```

### Validation Notes
- All JSON-LD can be validated with Google Rich Results Test
- Event schema only emitted for public trips with confirmed dates
- FAQPage follows Google's structured data guidelines
- Zero DOM elements added to visible page layout

