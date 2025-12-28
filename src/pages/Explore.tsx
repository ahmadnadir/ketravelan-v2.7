import { useState } from "react";
import { MapPin, Calendar, ChevronDown, SlidersHorizontal, Search as SearchIcon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { PillChip } from "@/components/shared/PillChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { mockTrips } from "@/data/mockData";

const categories = [
  "Nature & Outdoor",
  "City & Urban",
  "Cross Border",
  "Beach",
  "Culture",
  "Food",
  "Adventure",
];

export default function Explore() {
  const [tab, setTab] = useState("upcoming");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState([0, 2000]);
  const [filterOpen, setFilterOpen] = useState(false);

  const upcomingCount = mockTrips.length;
  const pastCount = 5;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Discover Trips</h1>

        {/* Search Panel */}
        <Card className="p-4 space-y-4 border-border/50">
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Where do you want to go?"
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 p-3 bg-secondary rounded-xl">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">Add dates</span>
            </div>
            <div className="flex-1 flex items-center gap-2 p-3 bg-secondary rounded-xl">
              <span className="text-sm text-muted-foreground">Any budget</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 rounded-xl">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Categories */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <PillChip
                          key={category}
                          label={category}
                          selected={selectedCategories.includes(category)}
                          onClick={() => toggleCategory(category)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Budget Range</h3>
                    <div className="px-2">
                      <Slider
                        value={budgetRange}
                        onValueChange={setBudgetRange}
                        min={0}
                        max={5000}
                        step={100}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>RM {budgetRange[0]}</span>
                      <span>RM {budgetRange[1]}+</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCategories([]);
                        setBudgetRange([0, 2000]);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setFilterOpen(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Card>

        {/* Tabs */}
        <SegmentedControl
          options={[
            { label: "Upcoming", value: "upcoming", count: upcomingCount },
            { label: "Past", value: "past", count: pastCount },
          ]}
          value={tab}
          onChange={setTab}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Found {upcomingCount} upcoming trips
          </span>
          <span className="text-muted-foreground text-xs">
            Showing prices in Malaysian Ringgit (RM)
          </span>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          {mockTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}