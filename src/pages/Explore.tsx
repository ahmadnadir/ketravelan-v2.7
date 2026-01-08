import { useState, useMemo, useRef } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Button } from "@/components/ui/button";
import { mockTrips } from "@/data/mockData";
import { tripCategories } from "@/data/categories";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { TripFilterDrawer, type FilterState } from "@/components/explore/TripFilterDrawer";
import { AppliedFiltersBar } from "@/components/explore/AppliedFiltersBar";
import { isDefaultBudgetRange, formatBudgetRange } from "@/components/explore/BudgetTierSelector";
import { ExplorePageSkeleton } from "@/components/skeletons/ExplorePageSkeleton";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { SEOHead } from "@/components/seo/SEOHead";

const defaultFilters: FilterState = {
  destination: "",
  dates: undefined,
  flexibleDates: false,
  budgetRange: [0, 10000],
  categories: [],
  currency: "MYR",
};

export default function Explore() {
  const isLoading = useSimulatedLoading(600);
  const [tab, setTab] = useState("upcoming");
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Applied filter state (affects results)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.destination) count++;
    if (appliedFilters.flexibleDates || appliedFilters.dates?.from) count++;
    if (!isDefaultBudgetRange(appliedFilters.budgetRange)) count++;
    count += appliedFilters.categories.length;
    if (appliedFilters.currency !== "MYR") count++;
    return count;
  }, [appliedFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  // Filter trips based on applied filters
  const filteredTrips = useMemo(() => {
    return mockTrips.filter((trip) => {
      // Destination match
      const destinationMatch =
        !appliedFilters.destination ||
        trip.title.toLowerCase().includes(appliedFilters.destination.toLowerCase()) ||
        trip.destination.toLowerCase().includes(appliedFilters.destination.toLowerCase());

      // Category match
      const categoryMatch =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.some((catId) => {
          const category = tripCategories.find((c) => c.id === catId);
          return trip.tags?.includes(category?.label || "");
        });

      // Budget match
      const [minBudget, maxBudget] = appliedFilters.budgetRange;
      const budgetMatch = trip.price >= minBudget && trip.price <= maxBudget;

      return destinationMatch && categoryMatch && budgetMatch;
    });
  }, [appliedFilters]);

  const pastCount = 5;

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    toast(`Showing ${filteredTrips.length} trips that match your filters`, {
      duration: 3000,
    });
  };

  const handleReset = () => {
    setAppliedFilters(defaultFilters);
  };

  const handleSearchTrips = () => {
    setIsDrawerOpen(true);
  };

  // Display text for the search bar
  const searchDisplayText = appliedFilters.destination || "Where do you want to go?";

  if (isLoading) {
    return (
      <AppLayout>
        <ExplorePageSkeleton />
      </AppLayout>
    );
  }

  return (
    <>
      <SEOHead
        title="Discover Group Trips & Travel Buddies | Ketravelan"
        description="Browse upcoming group trips to Asia, Europe, and beyond. Find your perfect travel group, from budget backpacking to luxury adventures. Join now!"
        canonicalUrl="https://ketravelan.com/explore"
        keywords={['group trips', 'travel buddies', 'budget travel', 'backpacking trips', 'adventure travel', 'find travel partners']}
      />
      <AppLayout>
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Discover Trips
        </h1>

        {/* Minimal Control Bar */}
        <div className="bg-card rounded-xl p-4 space-y-3">
          {/* Search Bar Row */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1 flex items-center gap-3 p-3.5 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors text-left"
            >
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className={cn(
                "text-sm truncate",
                appliedFilters.destination ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {searchDisplayText}
              </span>
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-3.5 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Applied Filters Summary */}
          {hasActiveFilters && (
            <AppliedFiltersBar
              destination={appliedFilters.destination}
              dates={appliedFilters.dates}
              flexibleDates={appliedFilters.flexibleDates}
              budgetRange={appliedFilters.budgetRange}
              categories={appliedFilters.categories}
              currency={appliedFilters.currency}
              onClear={handleReset}
              onEdit={() => setIsDrawerOpen(true)}
            />
          )}

          {/* Search Trips CTA */}
          <Button
            className="w-full rounded-xl h-12"
            onClick={handleSearchTrips}
            variant={hasActiveFilters ? "default" : "secondary"}
          >
            {hasActiveFilters ? `View ${filteredTrips.length} Trips` : "Search Trips"}
          </Button>
        </div>

        {/* Tabs */}
        <div ref={resultsRef}>
          <SegmentedControl
            options={[
              { label: "Upcoming", value: "upcoming", count: filteredTrips.length },
              { label: "Past", value: "past", count: pastCount },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {/* Results Header */}
        <div className="text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Found {filteredTrips.length} upcoming trips
          </span>
        </div>

        {/* Trip List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} displayCurrency={appliedFilters.currency} />
          ))}
        </div>
      </div>

      {/* Filter Drawer */}
      <TripFilterDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        filters={appliedFilters}
        onApply={handleApplyFilters}
        onReset={handleReset}
        matchingCount={filteredTrips.length}
      />
      </AppLayout>
    </>
  );
}
