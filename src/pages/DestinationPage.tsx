import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TripCard } from '@/components/shared/TripCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbSchema';
import { generateDestinationMeta, slugifyDestination } from '@/lib/seo';
import { mockTrips } from '@/data/mockData';
import { getAllPublishedTrips } from '@/lib/publishedTrips';
import { tripCategories } from '@/data/categories';

export default function DestinationPage() {
  const { destination } = useParams<{ destination: string }>();
  
  // Combine mock and published trips
  const allTrips = useMemo(() => {
    const published = getAllPublishedTrips()
      .filter(t => t.visibility === 'public')
      .map(t => ({
        id: t.id,
        title: t.title,
        destination: t.primaryDestination,
        imageUrl: t.galleryImages[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        startDate: t.startDate ? new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible',
        endDate: t.endDate ? new Date(t.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        price: t.budgetType === 'rough' ? t.roughBudgetTotal : Object.values(t.detailedBudget).reduce((a, b) => a + b, 0),
        slotsLeft: t.groupSizeType === 'set' ? t.groupSize - 1 : 9,
        totalSlots: t.groupSizeType === 'set' ? t.groupSize : 10,
        tags: t.travelStyles.map(s => tripCategories.find(c => c.id === s)?.label || s),
        isAlmostFull: t.groupSizeType === 'set' && t.groupSize <= 3,
        tripType: 'diy' as const,
      }));
    
    return [...published, ...mockTrips];
  }, []);
  
  // Filter trips by destination
  const filteredTrips = useMemo(() => {
    if (!destination) return [];
    
    const normalizedDest = destination.toLowerCase().replace(/-/g, ' ');
    
    return allTrips.filter(trip => {
      const tripDest = trip.destination.toLowerCase();
      return tripDest.includes(normalizedDest) || 
             normalizedDest.includes(tripDest.split(',')[0].trim().toLowerCase());
    });
  }, [destination, allTrips]);
  
  // Get destination display name
  const destinationName = useMemo(() => {
    if (!destination) return '';
    return destination
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [destination]);
  
  // Generate SEO meta
  const seoMeta = generateDestinationMeta(destinationName, filteredTrips.length);
  
  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: destinationName, url: `/destinations/${destination}` },
  ];
  
  // Get unique travel styles for this destination
  const availableStyles = useMemo(() => {
    const styles = new Set<string>();
    filteredTrips.forEach(trip => {
      trip.tags?.forEach(tag => styles.add(tag));
    });
    return Array.from(styles);
  }, [filteredTrips]);

  return (
    <AppLayout>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        canonicalUrl={seoMeta.canonicalUrl}
        keywords={['group trips', destinationName.toLowerCase(), 'travel buddies', 'budget travel']}
      />
      
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <BreadcrumbNav items={breadcrumbs} />
        
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Group Trips to {destinationName}
              </h1>
              <p className="text-muted-foreground">
                {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          
          {/* Description for SEO */}
          <p className="text-muted-foreground leading-relaxed">
            Discover group travel opportunities to {destinationName}. Join like-minded travelers, 
            share costs, and create unforgettable memories together. From budget backpacking to 
            curated experiences, find your perfect travel group.
          </p>
        </section>
        
        {/* Quick Filters - Travel Styles */}
        {availableStyles.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Filter by travel style</h2>
            <div className="flex flex-wrap gap-2">
              {availableStyles.map(style => {
                const category = tripCategories.find(c => c.label === style);
                return (
                  <Link
                    key={style}
                    to={`/style/${category?.id || style.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                  >
                    {category?.icon && <span>{category.icon}</span>}
                    <span>{style}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Trip Cards */}
        <section>
          {filteredTrips.length > 0 ? (
            <div className="space-y-4">
              {filteredTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  title={trip.title}
                  destination={trip.destination}
                  imageUrl={trip.imageUrl}
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                  price={trip.price}
                  slotsLeft={trip.slotsLeft}
                  totalSlots={trip.totalSlots}
                  tags={trip.tags}
                  isAlmostFull={trip.isAlmostFull}
                  tripType={trip.tripType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No trips to {destinationName} yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a trip to this destination!
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create a Trip
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
        
        {/* Related Destinations - Internal Linking */}
        <section className="pt-6 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Explore more destinations</h2>
          <div className="grid grid-cols-2 gap-3">
            {['Malaysia', 'Indonesia', 'Japan', 'Thailand', 'Vietnam', 'Philippines']
              .filter(d => d.toLowerCase() !== destinationName.toLowerCase())
              .slice(0, 4)
              .map(dest => (
                <Link
                  key={dest}
                  to={`/destinations/${slugifyDestination(dest)}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{dest}</span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
