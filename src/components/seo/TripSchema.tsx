import { Helmet } from 'react-helmet-async';

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface TripSchemaProps {
  name: string;
  description: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  currency?: string;
  image?: string;
  url: string;
  organizer?: {
    name: string;
    url?: string;
  };
  touristTypes?: string[];
  itinerary?: Array<{
    day: number;
    activities: string[];
  }>;
  visibility?: 'public' | 'private';
  geo?: GeoCoordinates;
}

export function TripSchema({
  name,
  description,
  destination,
  startDate,
  endDate,
  price,
  currency = 'MYR',
  image,
  url,
  organizer,
  touristTypes = [],
  itinerary = [],
  visibility = 'public',
  geo,
}: TripSchemaProps) {
  // --- TouristTrip schema ---
  const touristTrip: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    touristType: touristTypes.length > 0 ? touristTypes : ['Traveler'],
  };

  const placeObj: Record<string, any> = {
    '@type': 'Place',
    name: destination,
    address: {
      '@type': 'PostalAddress',
      addressLocality: destination,
    },
  };
  if (geo) {
    placeObj.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }
  touristTrip.itinerary = placeObj;

  if (startDate) touristTrip.startDate = startDate;
  if (endDate) touristTrip.endDate = endDate;
  if (image) touristTrip.image = image;

  if (price) {
    touristTrip.offers = {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url,
      validFrom: new Date().toISOString().split('T')[0],
    };
  }

  if (organizer) {
    touristTrip.organizer = {
      '@type': 'Organization',
      name: organizer.name,
      ...(organizer.url && { url: organizer.url }),
    };
  }

  if (itinerary.length > 0) {
    touristTrip.subTrip = itinerary.map((day) => ({
      '@type': 'TouristTrip',
      name: `Day ${day.day}`,
      description: day.activities.join(', '),
    }));
  }

  // --- Conditional Event schema (public trips with confirmed dates) ---
  const shouldIncludeEvent =
    visibility === 'public' && startDate && endDate && destination;

  const eventSchema: Record<string, any> | null = shouldIncludeEvent
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name,
        description,
        startDate,
        endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode:
          'https://schema.org/OfflineEventAttendanceMode',
        location: placeObj,
        ...(image && { image }),
        organizer: {
          '@type': 'Organization',
          name: organizer?.name || 'Ketravelan',
          url: organizer?.url || 'https://ketravelan.com',
        },
        ...(price && {
          offers: {
            '@type': 'Offer',
            price: price.toString(),
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
            url,
            validFrom: new Date().toISOString().split('T')[0],
          },
        }),
      }
    : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(touristTrip)}</script>
      {eventSchema && (
        <script type="application/ld+json">
          {JSON.stringify(eventSchema)}
        </script>
      )}
    </Helmet>
  );
}
