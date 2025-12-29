import { useState } from "react";
import { Link } from "react-router-dom";
import { TripCard } from "@/components/shared/TripCard";
import { mockTrips } from "@/data/mockData";
import { cn } from "@/lib/utils";

type TripMode = "diy" | "guided";

export function PopularTripsSection() {
  const [tripMode, setTripMode] = useState<TripMode>("diy");

  const filteredTrips = mockTrips.filter((trip) => trip.tripType === tripMode);

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Popular Trips on Ketravelan
        </h2>
        <Link to="/explore" className="text-xs sm:text-sm text-primary font-medium">
          See all
        </Link>
      </div>

      {/* Pills */}
      <div className="flex gap-2">
        <button
          onClick={() => setTripMode("diy")}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            tripMode === "diy"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          DIY Trips
        </button>
        <button
          onClick={() => setTripMode("guided")}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            tripMode === "guided"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Guided Trips
        </button>
      </div>

      {/* Trip Cards - Horizontal Scroll */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x snap-mandatory">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start"
            />
          ))
        ) : (
          <div className="w-full py-8 text-center text-muted-foreground text-sm">
            No {tripMode === "diy" ? "DIY" : "Guided"} trips available yet.
          </div>
        )}
      </div>
    </section>
  );
}
