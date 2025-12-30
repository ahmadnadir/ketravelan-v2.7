import { useState } from "react";
import { MapPin, Calendar, ChevronDown, SlidersHorizontal, Search as SearchIcon, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { PillChip } from "@/components/shared/PillChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { mockTrips } from "@/data/mockData";
import { toast } from "sonner";

const primaryCategories = ["Nature & Outdoor", "Beach", "City & Urban"];
const secondaryCategories = ["Cross Border", "Adventure", "Culture", "Food"];

export default function Explore() {
  const [tab, setTab] = useState("upcoming");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState([0, 2000]);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state calculations
  const hasActiveFilters = selectedCategories.length > 0 || budgetRange[0] > 0 || budgetRange[1] < 2000;
  const activeFilterCount = selectedCategories.length + (budgetRange[0] > 0 || budgetRange[1] < 2000 ? 1 : 0);

  const pastCount = 5;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setBudgetRange([0, 2000]);
  };

  const getFilteredTripsCount = () => {
    return mockTrips.filter(trip => {
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.some(cat => trip.tags?.includes(cat));
      const budgetMatch = trip.price >= budgetRange[0] && trip.price <= budgetRange[1];
      return categoryMatch && budgetMatch;
    }).length;
  };

  const handleApplyFilters = () => {
    setFilterOpen(false);
    const count = getFilteredTripsCount();
    toast(`Showing ${count} trips that match your filters`, {
      duration: 3000,
    });
  };

  const filteredTripsCount = getFilteredTripsCount();

  return (
    <AppLayout>
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Discover Trips</h1>

        {/* Search Panel */}
        <Card className="p-3 sm:p-4 space-y-3 sm:space-y-4 border-border/50">
          <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-secondary rounded-xl">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Where do you want to go?"
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-secondary rounded-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground truncate">Add dates</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-secondary rounded-xl">
              <span className="text-xs sm:text-sm text-muted-foreground truncate flex-1">Any budget</span>
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button className="flex-1 rounded-xl text-sm sm:text-base">
              <SearchIcon className="h-4 w-4 mr-1.5 sm:mr-2" />
              Search
            </Button>
            
            <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="rounded-xl text-sm sm:text-base relative">
                  <SlidersHorizontal className="h-4 w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[70vh]">
                <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">Close</span>
                </DrawerClose>
                
                <DrawerHeader className="text-left">
                  <DrawerTitle>Filters</DrawerTitle>
                </DrawerHeader>
                
                <ScrollArea className="flex-1 px-4 overflow-auto">
                  <div className="space-y-6 pb-4">
                    {/* Categories */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground text-sm">Categories</h3>
                      
                      {/* Primary row */}
                      <div className="flex flex-wrap gap-2">
                        {primaryCategories.map((category) => (
                          <PillChip
                            key={category}
                            label={category}
                            selected={selectedCategories.includes(category)}
                            onClick={() => toggleCategory(category)}
                            showCheckmark
                          />
                        ))}
                      </div>
                      
                      {/* Secondary row */}
                      <div className="flex flex-wrap gap-2">
                        {secondaryCategories.map((category) => (
                          <PillChip
                            key={category}
                            label={category}
                            selected={selectedCategories.includes(category)}
                            onClick={() => toggleCategory(category)}
                            showCheckmark
                          />
                        ))}
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground text-sm">Budget per person</h3>
                        <span className="text-sm font-medium text-primary">
                          Up to RM {budgetRange[1].toLocaleString()}
                        </span>
                      </div>
                      <div className="px-2 py-3">
                        <Slider
                          value={budgetRange}
                          onValueChange={setBudgetRange}
                          min={0}
                          max={5000}
                          step={100}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground/60">
                        <span>RM 0</span>
                        <span>RM 5,000+</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                
                <DrawerFooter className="border-t border-border/50 pt-4">
                  <p className="text-xs text-muted-foreground text-center pb-2">
                    Filters apply instantly to results
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      onClick={handleApplyFilters}
                    >
                      Apply
                    </Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </Card>

        {/* Quick Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategories.map((category) => (
              <PillChip
                key={category}
                label={category}
                size="sm"
                selected
                removable
                onClick={() => toggleCategory(category)}
              />
            ))}
            
            {(budgetRange[0] > 0 || budgetRange[1] < 2000) && (
              <PillChip
                label={`≤ RM ${budgetRange[1].toLocaleString()}`}
                size="sm"
                selected
                removable
                onClick={() => setBudgetRange([0, 2000])}
              />
            )}
            
            <button 
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Tabs */}
        <SegmentedControl
          options={[
            { label: "Upcoming", value: "upcoming", count: filteredTripsCount },
            { label: "Past", value: "past", count: pastCount },
          ]}
          value={tab}
          onChange={setTab}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Found {filteredTripsCount} upcoming trips
          </span>
          <span className="text-muted-foreground text-[10px] sm:text-xs">
            Showing prices in Malaysian Ringgit (RM)
          </span>
        </div>

        {/* Trip List */}
        <div className="space-y-3 sm:space-y-4">
          {mockTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
