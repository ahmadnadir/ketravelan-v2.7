import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbSchema';
import { generatePageMeta, slugifyDestination, extractDestinations } from '@/lib/seo';
import { mockTrips } from '@/data/mockData';
import { getAllPublishedTrips } from '@/lib/publishedTrips';

export default function DestinationsIndex() {
  // Combine mock and published trips
  const allTrips = useMemo(() => {
    const published = getAllPublishedTrips()
      .filter(t => t.visibility === 'public')
      .map(t => ({ destination: t.primaryDestination }));
    
    return [...published, ...mockTrips];
  }, []);
  
  // Get unique destinations with trip counts
  const destinations = useMemo(() => {
    const destMap = new Map<string, number>();
    
    allTrips.forEach(trip => {
      const parts = trip.destination.split(',');
      const country = parts[parts.length - 1]?.trim();
      if (country) {
        destMap.set(country, (destMap.get(country) || 0) + 1);
      }
    });
    
    return Array.from(destMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allTrips]);
  
  // SEO meta
  const seoMeta = generatePageMeta('destinations');
  
  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
  ];

  return (
    <AppLayout>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        canonicalUrl={seoMeta.canonicalUrl}
        keywords={['group trips', 'travel destinations', 'travel buddies', 'asia travel']}
      />
      
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <BreadcrumbNav items={breadcrumbs} />
        
        {/* Hero */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Travel Destinations
              </h1>
              <p className="text-muted-foreground">
                Explore group trips by location
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            Browse our curated collection of group travel destinations. From tropical beaches to 
            bustling cities, find your next adventure and connect with fellow travelers heading 
            to the same destination.
          </p>
        </section>
        
        {/* Destinations Grid */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {destinations.map(dest => (
              <Link
                key={dest.name}
                to={`/destinations/${slugifyDestination(dest.name)}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {dest.count} trip{dest.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {destinations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No destinations yet
              </h3>
              <p className="text-muted-foreground">
                Be the first to create a trip!
              </p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
