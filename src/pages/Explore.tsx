import { useState, useMemo, useRef, useEffect } from "react";
import { MapPin, Calendar, Check, ChevronDown, ChevronUp, Wallet } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockTrips } from "@/data/mockData";
import { tripCategories } from "@/data/categories";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";


export default function Explore() {
  const [tab, setTab] = useState("upcoming");
  const resultsRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Budget slider and date picker visibility
  const [showBudgetSlider, setShowBudgetSlider] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Scroll indicators
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  // Pending filter state (user is editing)
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingBudgetRange, setPendingBudgetRange] = useState([0, 5000]);
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [pendingDates, setPendingDates] = useState<DateRange | undefined>(undefined);

  // Applied filter state (affects results)
  const [appliedFilters, setAppliedFilters] = useState<{
    categories: string[];
    budgetRange: number[];
    searchQuery: string;
    dates: DateRange | undefined;
  }>({
    categories: [],
    budgetRange: [0, 5000],
    searchQuery: "",
    dates: undefined,
  });

  // Handle category scroll for fade indicators
  const handleCategoryScroll = () => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 10);
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    setShowRightFade(!isAtEnd);
  };

  useEffect(() => {
    handleCategoryScroll();
  }, []);

  // Format date range for display
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Add dates";
    if (!range.to) return format(range.from, "MMM d");
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d")}`;
  };

  const pastCount = 5;

  // Check if any filter has changed from default/applied state
  const hasFilterChanges = useMemo(() => {
    const categoriesChanged = 
      pendingCategories.length !== appliedFilters.categories.length ||
      pendingCategories.some((c) => !appliedFilters.categories.includes(c));
    const budgetChanged =
      pendingBudgetRange[0] !== appliedFilters.budgetRange[0] ||
      pendingBudgetRange[1] !== appliedFilters.budgetRange[1];
    const searchChanged = pendingSearchQuery !== appliedFilters.searchQuery;
    const datesChanged = 
      pendingDates?.from?.getTime() !== appliedFilters.dates?.from?.getTime() ||
      pendingDates?.to?.getTime() !== appliedFilters.dates?.to?.getTime();
    
    return categoriesChanged || budgetChanged || searchChanged || datesChanged;
  }, [pendingCategories, pendingBudgetRange, pendingSearchQuery, pendingDates, appliedFilters]);

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
      const categoryMatch =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.some((catId) => {
          const category = tripCategories.find((c) => c.id === catId);
          return trip.tags?.includes(category?.label || "");
        });

      const budgetMatch =
        trip.price >= appliedFilters.budgetRange[0] &&
        trip.price <= appliedFilters.budgetRange[1];

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
    setPendingDates(undefined);
    setAppliedFilters({
      categories: [],
      budgetRange: [0, 5000],
      searchQuery: "",
      dates: undefined,
    });
    // Collapse expanded sections
    setShowBudgetSlider(false);
    setDatePickerOpen(false);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      categories: pendingCategories,
      budgetRange: pendingBudgetRange,
      searchQuery: pendingSearchQuery,
      dates: pendingDates,
    });

    // Collapse expanded sections after applying
    setShowBudgetSlider(false);
    setDatePickerOpen(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

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

  // Budget summary text
  const budgetSummary = pendingBudgetRange[1] < 5000 
    ? `Up to RM ${pendingBudgetRange[1].toLocaleString()}`
    : "Any budget";

  return (
    <AppLayout>
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Discover Trips
        </h1>

        {/* Unified Filter Panel - Compact */}
        <Card className="p-4 space-y-3 border-border/50">
          {/* Search Input */}
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Where do you want to go?"
              value={pendingSearchQuery}
              onChange={(e) => setPendingSearchQuery(e.target.value)}
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm sm:text-base"
            />
          </div>

          {/* Date + Budget Row */}
          <div className="flex gap-2">
            {/* Date Selector with Calendar Popover */}
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors",
                    pendingDates?.from && "bg-primary/10 text-primary"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span className={cn(
                    pendingDates?.from ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {formatDateRange(pendingDates)}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={pendingDates}
                  onSelect={setPendingDates}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Budget Summary (Collapsed) */}
            <button
              onClick={() => setShowBudgetSlider(!showBudgetSlider)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors",
                pendingBudgetRange[1] < 5000 && "bg-primary/10 text-primary"
              )}
            >
              <Wallet className="h-4 w-4" />
              <span>{budgetSummary}</span>
              {showBudgetSlider ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Budget Slider (Expandable) */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-out",
              showBudgetSlider ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="space-y-2 pt-1 pb-2">
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
          </div>

          {/* Categories - Horizontal Scrollable with Fade Indicators */}
          <div className="-mx-4 px-4 relative">
            {/* Left fade indicator */}
            <div 
              className={cn(
                "absolute left-4 top-0 bottom-1 w-8 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none transition-opacity duration-200",
                showLeftFade ? "opacity-100" : "opacity-0"
              )}
            />
            
            <div 
              ref={categoryScrollRef}
              onScroll={handleCategoryScroll}
              className="flex gap-2 overflow-x-auto pb-1" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tripCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => togglePendingCategory(category.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap shrink-0",
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
            
            {/* Right fade indicator */}
            <div 
              className={cn(
                "absolute right-4 top-0 bottom-1 w-8 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none transition-opacity duration-200",
                showRightFade ? "opacity-100" : "opacity-0"
              )}
            />
          </div>

          {/* Action Buttons - Conditional visibility with slide animation */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-out",
              hasFilterChanges ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
            )}
          >
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
