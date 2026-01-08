import { Helmet } from 'react-helmet-async';

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
}: TripSchemaProps) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description,
    touristType: touristTypes.length > 0 ? touristTypes : ['Traveler'],
  };

  // Add destination as Place
  schema.itinerary = {
    '@type': 'Place',
    name: destination,
    address: {
      '@type': 'PostalAddress',
      addressLocality: destination,
    },
  };

  // Add dates if available
  if (startDate) {
    schema.startDate = startDate;
  }
  if (endDate) {
    schema.endDate = endDate;
  }

  // Add image if available
  if (image) {
    schema.image = image;
  }

  // Add offer (price)
  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url,
    };
  }

  // Add organizer
  if (organizer) {
    schema.organizer = {
      '@type': 'Person',
      name: organizer.name,
      ...(organizer.url && { url: organizer.url }),
    };
  }

  // Add day-by-day itinerary if available
  if (itinerary.length > 0) {
    schema.subTrip = itinerary.map((day) => ({
      '@type': 'TouristTrip',
      name: `Day ${day.day}`,
      description: day.activities.join(', '),
    }));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
