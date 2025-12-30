import { useState, useMemo, useRef } from "react";
import { MapPin, Calendar, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { mockTrips } from "@/data/mockData";
import { tripCategories } from "@/data/categories";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Explore() {
  const [tab, setTab] = useState("upcoming");
  const resultsRef = useRef<HTMLDivElement>(null);

  // Pending filter state (user is editing)
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingBudgetRange, setPendingBudgetRange] = useState([0, 5000]);
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [pendingDates, setPendingDates] = useState<string>("");

  // Applied filter state (affects results)
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [] as string[],
    budgetRange: [0, 5000],
    searchQuery: "",
    dates: "",
  });

  const pastCount = 5;

  const togglePendingCategory = (categoryId: string) => {
    setPendingCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter trips based on APPLIED filters
  const filteredTrips = useMemo(() => {
    return mockTrips.filter((trip) => {
      // Category match
      const categoryMatch =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.some((catId) => {
          const category = tripCategories.find((c) => c.id === catId);
          return trip.tags?.includes(category?.label || "");
        });

      // Budget match
      const budgetMatch =
        trip.price >= appliedFilters.budgetRange[0] &&
        trip.price <= appliedFilters.budgetRange[1];

      // Search query match (destination or title)
      const searchMatch =
        !appliedFilters.searchQuery ||
        trip.title
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase()) ||
        trip.destination
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase());

      return categoryMatch && budgetMatch && searchMatch;
    });
  }, [appliedFilters]);

  const handleReset = () => {
    setPendingCategories([]);
    setPendingBudgetRange([0, 5000]);
    setPendingSearchQuery("");
    setPendingDates("");
    setAppliedFilters({
      categories: [],
      budgetRange: [0, 5000],
      searchQuery: "",
      dates: "",
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      categories: pendingCategories,
      budgetRange: pendingBudgetRange,
      searchQuery: pendingSearchQuery,
      dates: pendingDates,
    });

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Calculate count after applying
    const count = mockTrips.filter((trip) => {
      const categoryMatch =
        pendingCategories.length === 0 ||
        pendingCategories.some((catId) => {
          const category = tripCategories.find((c) => c.id === catId);
          return trip.tags?.includes(category?.label || "");
        });
      const budgetMatch =
        trip.price >= pendingBudgetRange[0] &&
        trip.price <= pendingBudgetRange[1];
      const searchMatch =
        !pendingSearchQuery ||
        trip.title.toLowerCase().includes(pendingSearchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(pendingSearchQuery.toLowerCase());
      return categoryMatch && budgetMatch && searchMatch;
    }).length;

    toast(`Showing ${count} trips that match your filters`, {
      duration: 3000,
    });
  };

  return (
    <AppLayout>
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Discover Trips
        </h1>

        {/* Unified Filter Panel */}
        <Card className="p-4 space-y-4 border-border/50">
          {/* A. Search Input */}
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Where do you want to go?"
              value={pendingSearchQuery}
              onChange={(e) => setPendingSearchQuery(e.target.value)}
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm sm:text-base"
            />
          </div>

          {/* B. Date Selector (pill button) */}
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {pendingDates || "Add dates"}
            </span>
          </button>

          {/* C. Categories (scrollable pills with icons) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {tripCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => togglePendingCategory(category.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
                    pendingCategories.includes(category.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {pendingCategories.includes(category.id) && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* D. Budget Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                Budget per person
              </h3>
              <span className="text-sm font-medium text-primary">
                Up to RM {pendingBudgetRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              value={pendingBudgetRange}
              onValueChange={setPendingBudgetRange}
              min={0}
              max={5000}
              step={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground/60">
              <span>RM 0</span>
              <span>RM 5,000+</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button className="flex-1 rounded-xl" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </Card>

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Found {filteredTrips.length} upcoming trips
          </span>
          <span className="text-muted-foreground text-[10px] sm:text-xs">
            Showing prices in Malaysian Ringgit (RM)
          </span>
        </div>

        {/* Trip List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
