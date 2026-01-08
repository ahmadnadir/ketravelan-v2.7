import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbSchema';
import { generatePageMeta } from '@/lib/seo';
import { tripCategories } from '@/data/categories';
import { mockTrips } from '@/data/mockData';
import { getAllPublishedTrips } from '@/lib/publishedTrips';

export default function TravelStylesIndex() {
  // Count trips per style
  const styleCounts = useMemo(() => {
    const published = getAllPublishedTrips().filter(t => t.visibility === 'public');
    const counts = new Map<string, number>();
    
    // Count from published trips
    published.forEach(trip => {
      trip.travelStyles.forEach(style => {
        counts.set(style, (counts.get(style) || 0) + 1);
      });
    });
    
    // Count from mock trips
    mockTrips.forEach(trip => {
      trip.tags.forEach(tag => {
        const category = tripCategories.find(c => c.label === tag);
        if (category) {
          counts.set(category.id, (counts.get(category.id) || 0) + 1);
        }
      });
    });
    
    return counts;
  }, []);
  
  // SEO meta
  const seoMeta = generatePageMeta('styles');
  
  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Styles', url: '/style' },
  ];
  
  // Style descriptions
  const styleDescriptions: Record<string, string> = {
    'nature-outdoor': 'Hiking, camping, and natural wonders',
    'beach': 'Sun, sand, and coastal getaways',
    'city-urban': 'Metropolitan culture and city life',
    'adventure': 'Adrenaline and extreme experiences',
    'culture': 'Heritage, history, and traditions',
    'food': 'Culinary adventures and local cuisine',
    'cross-border': 'Multi-country explorations',
  };

  return (
    <AppLayout>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        canonicalUrl={seoMeta.canonicalUrl}
        keywords={['travel styles', 'group trips', 'adventure travel', 'budget travel']}
      />
      
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <BreadcrumbNav items={breadcrumbs} />
        
        {/* Hero */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Travel Styles
              </h1>
              <p className="text-muted-foreground">
                Find trips that match your vibe
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            Whether you're seeking adventure, relaxation, or cultural immersion, find group trips 
            that align with your travel preferences. Connect with like-minded travelers who share 
            your passion.
          </p>
        </section>
        
        {/* Styles Grid */}
        <section>
          <div className="grid grid-cols-1 gap-4">
            {tripCategories.map(cat => {
              const count = styleCounts.get(cat.id) || 0;
              return (
                <Link
                  key={cat.id}
                  to={`/style/${cat.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="h-14 w-14 rounded-xl bg-background flex items-center justify-center text-2xl">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{cat.label}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {styleDescriptions[cat.id] || 'Explore this travel style'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {count} trip{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
