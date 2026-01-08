import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TripCard } from '@/components/shared/TripCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbSchema';
import { generateStyleMeta, slugifyDestination } from '@/lib/seo';
import { mockTrips } from '@/data/mockData';
import { getAllPublishedTrips } from '@/lib/publishedTrips';
import { tripCategories } from '@/data/categories';

export default function TravelStylePage() {
  const { style } = useParams<{ style: string }>();
  
  // Find the category
  const category = useMemo(() => {
    return tripCategories.find(c => c.id === style);
  }, [style]);
  
  const styleName = category?.label || style?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';
  const styleIcon = category?.icon || '✨';
  
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
        travelStyleIds: t.travelStyles,
        isAlmostFull: t.groupSizeType === 'set' && t.groupSize <= 3,
        tripType: 'diy' as const,
      }));
    
    return [...published, ...mockTrips.map(t => ({ ...t, travelStyleIds: [] }))];
  }, []);
  
  // Filter trips by travel style
  const filteredTrips = useMemo(() => {
    if (!style) return [];
    
    return allTrips.filter(trip => {
      // Check travelStyleIds for published trips
      if ('travelStyleIds' in trip && trip.travelStyleIds.includes(style)) {
        return true;
      }
      // Check tags for mock trips
      return trip.tags?.some(tag => 
        tag.toLowerCase() === styleName.toLowerCase() ||
        tag.toLowerCase().includes(style.replace(/-/g, ' '))
      );
    });
  }, [style, styleName, allTrips]);
  
  // Generate SEO meta
  const seoMeta = generateStyleMeta(style || '', filteredTrips.length);
  
  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Styles', url: '/style' },
    { name: styleName, url: `/style/${style}` },
  ];
  
  // Get unique destinations for this style
  const availableDestinations = useMemo(() => {
    const destinations = new Set<string>();
    filteredTrips.forEach(trip => {
      const country = trip.destination.split(',').pop()?.trim();
      if (country) destinations.add(country);
    });
    return Array.from(destinations);
  }, [filteredTrips]);
  
  // Style descriptions for SEO content
  const styleDescriptions: Record<string, string> = {
    'nature-outdoor': 'Immerse yourself in breathtaking landscapes, hiking trails, and natural wonders. Perfect for nature lovers seeking outdoor adventures.',
    'beach': 'Sun, sand, and sea await! Find group trips to pristine beaches, island hopping adventures, and coastal getaways.',
    'city-urban': 'Explore vibrant cities, experience urban culture, and discover the best of metropolitan destinations with fellow travelers.',
    'adventure': 'Push your limits with adrenaline-pumping activities, extreme sports, and once-in-a-lifetime experiences.',
    'culture': 'Dive deep into local traditions, historical sites, and authentic cultural experiences that broaden your horizons.',
    'food': 'Taste your way around the world! Join food-focused trips featuring local cuisines, cooking classes, and culinary adventures.',
    'cross-border': 'Multi-country adventures that let you explore multiple destinations in a single trip.',
  };

  return (
    <AppLayout>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        canonicalUrl={seoMeta.canonicalUrl}
        keywords={['group trips', styleName.toLowerCase(), 'travel buddies', 'travel style']}
      />
      
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <BreadcrumbNav items={breadcrumbs} />
        
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
              {styleIcon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {styleName} Group Trips
              </h1>
              <p className="text-muted-foreground">
                {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          
          {/* Description for SEO */}
          <p className="text-muted-foreground leading-relaxed">
            {styleDescriptions[style || ''] || 
              `Discover ${styleName.toLowerCase()} group travel experiences. Join like-minded travelers who share your passion and create unforgettable memories together.`
            }
          </p>
        </section>
        
        {/* Quick Filters - Destinations */}
        {availableDestinations.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Popular destinations</h2>
            <div className="flex flex-wrap gap-2">
              {availableDestinations.slice(0, 6).map(dest => (
                <Link
                  key={dest}
                  to={`/destinations/${slugifyDestination(dest)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                >
                  <span>{dest}</span>
                </Link>
              ))}
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
              <div className="h-12 w-12 text-2xl mx-auto mb-4">{styleIcon}</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No {styleName.toLowerCase()} trips yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a {styleName.toLowerCase()} trip!
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
        
        {/* Other Travel Styles - Internal Linking */}
        <section className="pt-6 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Explore other travel styles</h2>
          <div className="grid grid-cols-2 gap-3">
            {tripCategories
              .filter(c => c.id !== style)
              .slice(0, 6)
              .map(cat => (
                <Link
                  key={cat.id}
                  to={`/style/${cat.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium text-foreground">{cat.label}</span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
