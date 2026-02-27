/**
 * Sitemap generator for Ketravelan.
 *
 * In a CSR SPA the sitemap is best served from an edge function or
 * regenerated at build time.  This utility produces the XML string
 * so it can be used in either scenario.
 */

import { mockTrips } from '@/data/mockData';
import { getAllPublishedTrips } from '@/lib/publishedTrips';
import { generateTripSlug } from '@/lib/seo';

const SITE_URL = 'https://ketravelan.com';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function toISODate(dateStr?: string | number): string {
  try {
    const d = typeof dateStr === 'number' ? new Date(dateStr) : new Date(dateStr || Date.now());
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function generateSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/explore', priority: '0.9', changefreq: 'daily' },
    { path: '/destinations', priority: '0.8', changefreq: 'weekly' },
    { path: '/style', priority: '0.8', changefreq: 'weekly' },
    { path: '/community', priority: '0.7', changefreq: 'daily' },
  ];

  staticPages.forEach((p) =>
    entries.push({
      loc: `${SITE_URL}${p.path}`,
      lastmod: toISODate(),
      changefreq: p.changefreq,
      priority: p.priority,
    }),
  );

  // Mock trips (always public)
  mockTrips.forEach((trip) => {
    const slug = generateTripSlug(trip);
    entries.push({
      loc: `${SITE_URL}/trips/${slug}`,
      lastmod: toISODate(),
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // Published trips (only public)
  getAllPublishedTrips()
    .filter((t) => t.visibility === 'public')
    .forEach((trip) => {
      const slug = generateTripSlug({
        id: trip.id,
        title: trip.title,
        destination: trip.primaryDestination,
        tags: trip.travelStyles,
        startDate: trip.startDate,
      });
      entries.push({
        loc: `${SITE_URL}/trips/${slug}`,
        lastmod: toISODate(trip.createdAt),
        changefreq: 'weekly',
        priority: '0.7',
      });
    });

  // Destination pages
  const destinations = new Set<string>();
  mockTrips.forEach((t) => {
    const country = t.destination.split(',').pop()?.trim();
    if (country) destinations.add(country);
  });
  destinations.forEach((dest) =>
    entries.push({
      loc: `${SITE_URL}/destinations/${dest.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: toISODate(),
      changefreq: 'weekly',
      priority: '0.6',
    }),
  );

  return entries;
}

export function generateSitemapXml(): string {
  const entries = generateSitemapEntries();
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}${e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : ''}${e.priority ? `\n    <priority>${e.priority}</priority>` : ''}\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
