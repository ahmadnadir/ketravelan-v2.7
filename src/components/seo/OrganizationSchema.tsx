import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://ketravelan.com';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ketravelan',
    url: SITE_URL,
    logo: `${SITE_URL}/pwa-512x512.png`,
    description:
      'Ketravelan helps travelers find group trips, travel buddies, and plan adventures together. Split costs, coordinate itineraries, and explore the world as a group.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE_URL}/feedback`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
