

## SEO Enhancement Plan for Trip Details Page

### Audit Confirmation

**Currently working:**
- SEOHead with dynamic title, description, OG tags, Twitter cards
- TripSchema (JSON-LD TouristTrip) with basic fields
- BreadcrumbSchema (JSON-LD)
- Slug generation via `generateTripSlug()`
- `noIndex` for private trips
- Both `/trips/:slug` and `/trip/:id` routes exist

**Issues found:**
- `/trip/:id` route is indexable (no noindex, no redirect) -- duplicate content risk
- TripDetails component only reads `useParams().id`, ignoring slug route entirely
- `parseSlugToId` exists but is never used
- Canonical URL uses `window.location.origin` instead of fixed production domain
- No explicit `index, follow` for public trips
- No Organization, FAQ, or Event schemas
- Section headings skip from H1 to H3
- Image thumbnails have `alt=""`
- No visible breadcrumb nav
- No related/internal links section
- No "Trip in 30 seconds" summary
- No sitemap generation
- No prerendering strategy

---

### Changes

#### 1. Route Canonicalization

**File: `src/pages/TripDetails.tsx`**
- Read both `id` and `slug` from `useParams` (the route provides one or the other)
- When accessed via `/trip/:id`, programmatically redirect to `/trips/:slug` using `navigate(replace: true)` so only `/trips/:slug` is indexable
- Use `parseSlugToId` from `seo.ts` when accessed via `/trips/:slug` to resolve the trip ID

**File: `src/App.tsx`**
- Keep both routes, but the `/trip/:id` one will redirect at component level

#### 2. SEOHead Fixes

**File: `src/components/seo/SEOHead.tsx`**
- Add explicit `<meta name="robots" content="index, follow" />` when `noIndex` is false
- All canonical URLs will use `SITE_URL` constant from `seo.ts` (already defined as `https://ketravelan.com`)

**File: `src/pages/TripDetails.tsx`**
- Replace `window.location.origin` with imported `SITE_URL` for canonical and breadcrumb URLs

#### 3. Semantic HTML and Visible Breadcrumbs

**File: `src/pages/TripDetails.tsx`**
- Wrap main content in `<article>`
- Upgrade `<h3>` section headings to `<h2>` ("About This Trip", "What to Expect", "Budget Breakdown", etc.)
- Add `<section>` wrappers with `aria-label` for each content block
- Render `BreadcrumbNav` (from existing `BreadcrumbSchema.tsx`) above the title showing: Home > Explore > [Destination] > [Trip Title]
- Use `SITE_URL` for all breadcrumb URLs

#### 4. "Trip in 30 Seconds" Summary

**File: `src/pages/TripDetails.tsx`**
- Add a bullet-point summary block directly below the tags/members area, before the tabs
- Contains: destination, dates (or "Flexible"), group size, budget per person, travel styles
- Plain HTML list for AI crawlability

#### 5. New Schema Components

**New file: `src/components/seo/OrganizationSchema.tsx`**
- JSON-LD Organization for "Ketravelan" with name, url, logo, description

**New file: `src/components/seo/FAQSchema.tsx`**
- Accepts `Array<{question: string, answer: string}>`, outputs FAQPage JSON-LD

#### 6. Enhanced Structured Data

**File: `src/components/seo/TripSchema.tsx`**
- Add Event schema alongside TouristTrip when trip is public AND has confirmed start/end dates AND location
- Include `eventStatus: EventScheduled`, `eventAttendanceMode: OfflineEventAttendanceMode`
- Add geo coordinates to destination Place if available (optional field)
- Ensure `offers` includes `validFrom` and `availability`

**File: `src/pages/TripDetails.tsx`**
- Add OrganizationSchema to the page
- Generate contextual FAQ items from trip data:
  - "How do I join this trip?" (answer from join flow)
  - "What's included in the budget of RM X?" (answer from budget breakdown)
  - "When does this trip start?" (answer from dates)
  - "Who organizes this trip?" (answer: Ketravelan community)
- Render FAQ section visually in the overview tab AND as FAQSchema JSON-LD
- Pass `visibility` to TripSchema so Event schema is only added for public trips

#### 7. Image Alt Text

**File: `src/pages/TripDetails.tsx`**
- Main gallery image: `alt="{title} - {destination} photo {n} of {total}"`
- Thumbnails: `alt="View photo {n} of {title}"`
- Share modal preview image: descriptive alt

#### 8. Internal Links Section

**File: `src/pages/TripDetails.tsx`**
- Add "More Trips in [Destination]" section after overview tab content
- Add "Similar Trips" section filtered by matching tags
- Use `<Link to="/trips/...">` (renders as crawlable `<a href>`)
- Show 3-4 trip cards from `mockTrips` filtered by destination or tags

#### 9. Sitemap Support

**New file: `src/lib/sitemap.ts`**
- Export function `generateSitemapXml()` that:
  - Iterates all public mock trips + published trips (non-private)
  - Generates `<url>` entries for `/trips/:slug` with `<lastmod>` from `createdAt`
  - Includes static pages: `/`, `/explore`, `/destinations`, `/style`
  - Excludes private/draft trips
- This is a utility that can be called to generate the XML string

**New file: `public/sitemap.xml`** (or generated approach)
- Since this is a SPA, we'll create a static sitemap for the known routes
- For dynamic trips, document that this should be regenerated on deploy or served from an edge function

#### 10. Prerendering Strategy (Track B)

**File: `vite.config.ts`**
- Add `vite-plugin-prerender` (or document the approach) to prerender key public pages at build time:
  - `/trips/:slug` for each public trip
  - `/destinations/:destination` for each destination
  - `/style/:style` for each travel style
- This ensures the HTML includes the JSON-LD and meta tags in the raw source, making it crawlable by AI agents that don't execute JavaScript
- If the plugin is too heavy, document an alternative: a post-build script using `puppeteer` or `prerender.io` as a proxy

**Note:** Since we cannot install new npm packages in this flow, the prerendering section will be implemented as configuration + documentation for the `vite-plugin-prerender` approach, ready to activate when the dependency is added.

---

### Files Summary

| File | Action |
|------|--------|
| `src/pages/TripDetails.tsx` | Major update: route canonicalization, semantic HTML, breadcrumbs, summary, FAQ section, alt text, internal links, SITE_URL usage |
| `src/components/seo/SEOHead.tsx` | Add explicit index/follow robots tag |
| `src/components/seo/TripSchema.tsx` | Add conditional Event schema, geo coordinates |
| `src/components/seo/OrganizationSchema.tsx` | New -- Organization JSON-LD |
| `src/components/seo/FAQSchema.tsx` | New -- FAQPage JSON-LD |
| `src/lib/sitemap.ts` | New -- sitemap XML generator utility |
| `src/lib/seo.ts` | Export SITE_URL (already exists, may need minor additions) |

### Validation Notes

- Structured data can be validated with Google Rich Results Test and Schema.org validator
- Canonical behavior: accessing `/trip/1` will redirect to `/trips/langkawi-island-adventure-jan-2025-1`, ensuring single indexable URL
- `robots` meta tag explicitly set for both index and noindex cases
- FAQ schema follows Google's FAQPage guidelines (question + acceptedAnswer pairs)
- Event schema only emitted for public trips with confirmed dates
- All internal links use `<Link>` which renders as `<a href>` for crawlability
- Prerendering approach documented for Track B -- ready to activate with plugin install

