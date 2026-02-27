// SEO utilities for Ketravelan
// Generates meta tags, structured data, and SEO-friendly content

import { PublishedTrip } from './publishedTrips';
import { tripCategories } from '@/data/categories';

const SITE_NAME = 'Ketravelan';
export const SITE_URL = 'https://ketravelan.com';
const DEFAULT_OG_IMAGE = 'https://lovable.dev/opengraph-image-p98pqg.png';

export interface TripMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  keywords: string[];
}

export interface PageMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  noIndex?: boolean;
}

// Generate SEO-friendly meta for a trip page
export function generateTripMeta(trip: {
  id: string;
  slug?: string;
  title: string;
  destination: string;
  description?: string;
  tags?: string[];
  price?: number;
  totalSlots?: number;
  slotsLeft?: number;
  startDate?: string;
  galleryImages?: string[];
  visibility?: 'public' | 'private';
}): TripMeta {
  const travelStyles = trip.tags?.slice(0, 2).join(' & ') || 'Group';
  const priceText = trip.price ? `From RM ${trip.price}` : '';
  
  // Generate compelling title (under 60 chars)
  const title = `${trip.title} - ${trip.destination} | ${SITE_NAME}`.slice(0, 60);
  
  // Generate meta description (under 160 chars)
  const slotsText = trip.slotsLeft && trip.totalSlots 
    ? `${trip.slotsLeft} spots left. `
    : '';
  const dateText = trip.startDate 
    ? `Starting ${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}. `
    : '';
  
  const description = `Join this ${travelStyles} group trip to ${trip.destination}. ${priceText}. ${slotsText}${dateText}`.trim().slice(0, 160);
  
  // Generate keywords
  const keywords = [
    'group trip',
    'travel buddies',
    trip.destination.toLowerCase(),
    ...(trip.tags || []).map(t => t.toLowerCase()),
    'travel group',
    'budget travel',
  ];
  
  const slug = trip.slug || generateTripSlug(trip);
  
  return {
    title,
    description,
    canonicalUrl: `${SITE_URL}/trips/${slug}`,
    ogImage: trip.galleryImages?.[0] || DEFAULT_OG_IMAGE,
    keywords,
  };
}

// Generate SEO-friendly slug from trip data
export function generateTripSlug(trip: {
  id: string;
  title: string;
  destination: string;
  tags?: string[];
  startDate?: string;
}): string {
  const slugify = (str: string) => 
    str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  
  const parts: string[] = [];
  
  // Add destination (first word or two)
  const destParts = trip.destination.split(/[,\s]+/).slice(0, 2);
  parts.push(slugify(destParts.join('-')));
  
  // Add title (first 3-4 words)
  const titleWords = trip.title.split(/\s+/).slice(0, 4);
  parts.push(slugify(titleWords.join('-')));
  
  // Add month/year if available
  if (trip.startDate) {
    const date = new Date(trip.startDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    const year = date.getFullYear();
    parts.push(`${month}-${year}`);
  }
  
  // Add ID suffix for uniqueness
  parts.push(trip.id.slice(0, 8));
  
  return parts.filter(Boolean).join('-');
}

// Parse slug back to ID (last segment)
export function parseSlugToId(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

// Generate page meta for static pages
export function generatePageMeta(page: 'home' | 'explore' | 'destinations' | 'styles'): PageMeta {
  const pages: Record<string, PageMeta> = {
    home: {
      title: `${SITE_NAME} - Find Travel Buddies & Group Trips`,
      description: 'Join group trips, find travel buddies, and explore the world together. Plan trips with friends, not spreadsheets. Coordinate destinations, budgets, and itineraries.',
      canonicalUrl: SITE_URL,
    },
    explore: {
      title: `Discover Group Trips & Travel Buddies | ${SITE_NAME}`,
      description: 'Browse upcoming group trips to Asia, Europe, and beyond. Find your perfect travel group, from budget backpacking to luxury adventures.',
      canonicalUrl: `${SITE_URL}/explore`,
    },
    destinations: {
      title: `Travel Destinations - Group Trips by Location | ${SITE_NAME}`,
      description: 'Explore group trips by destination. Find travel buddies heading to Malaysia, Indonesia, Japan, Thailand, and more.',
      canonicalUrl: `${SITE_URL}/destinations`,
    },
    styles: {
      title: `Travel Styles - Budget, Adventure, Culture Trips | ${SITE_NAME}`,
      description: 'Find group trips that match your travel style. From budget backpacking to luxury retreats, adventure tours to cultural immersions.',
      canonicalUrl: `${SITE_URL}/style`,
    },
  };
  
  return pages[page];
}

// Generate destination page meta
export function generateDestinationMeta(destination: string, tripCount: number): PageMeta {
  const title = `Group Trips to ${destination} | ${SITE_NAME}`.slice(0, 60);
  const description = `Join ${tripCount}+ group trips to ${destination}. Find travel buddies, split costs, and explore together. Book your spot today!`.slice(0, 160);
  
  return {
    title,
    description,
    canonicalUrl: `${SITE_URL}/destinations/${slugifyDestination(destination)}`,
  };
}

// Generate travel style page meta
export function generateStyleMeta(styleId: string, tripCount: number): PageMeta {
  const category = tripCategories.find(c => c.id === styleId);
  const styleName = category?.label || styleId;
  
  const title = `${styleName} Group Trips | ${SITE_NAME}`.slice(0, 60);
  const description = `Discover ${tripCount}+ ${styleName.toLowerCase()} group trips. Find like-minded travelers, share costs, and create unforgettable memories.`.slice(0, 160);
  
  return {
    title,
    description,
    canonicalUrl: `${SITE_URL}/style/${styleId}`,
  };
}

// Generate month page meta
export function generateMonthMeta(month: string, year: number, tripCount: number): PageMeta {
  const title = `Group Trips in ${month} ${year} | ${SITE_NAME}`.slice(0, 60);
  const description = `Join ${tripCount}+ group trips departing in ${month} ${year}. Find travel buddies and book your adventure today!`.slice(0, 160);
  
  return {
    title,
    description,
    canonicalUrl: `${SITE_URL}/trips/month/${month.toLowerCase()}-${year}`,
  };
}

// Helper to slugify destination names
export function slugifyDestination(destination: string): string {
  return destination
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Get unique destinations from trips
export function extractDestinations(trips: Array<{ destination: string }>): string[] {
  const destinations = new Set<string>();
  trips.forEach(trip => {
    // Extract country/region from "City, Country" format
    const parts = trip.destination.split(',');
    const country = parts[parts.length - 1]?.trim();
    if (country) destinations.add(country);
  });
  return Array.from(destinations).sort();
}

// Get unique travel styles from trips
export function extractTravelStyles(trips: Array<{ tags?: string[] }>): string[] {
  const styles = new Set<string>();
  trips.forEach(trip => {
    trip.tags?.forEach(tag => {
      const category = tripCategories.find(c => c.label === tag);
      if (category) styles.add(category.id);
    });
  });
  return Array.from(styles);
}

// Check if a page should be indexed
export function shouldIndex(trip: { visibility?: 'public' | 'private' }): boolean {
  return trip.visibility !== 'private';
}
