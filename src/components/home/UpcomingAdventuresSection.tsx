import { Link } from "react-router-dom";
import { TripCard } from "@/components/shared/TripCard";
import { mockTrips } from "@/data/mockData";

export function UpcomingAdventuresSection() {
  const diyTrips = mockTrips.filter((trip) => trip.tripType === "diy");

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Join the Adventure
          </h2>
          <Link to="/explore" className="text-xs sm:text-sm text-primary font-medium">
            See all
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Discover open trips happening soon.
        </p>
      </div>

      {/* Trip Cards - Horizontal Scroll */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x snap-mandatory">
        {diyTrips.length > 0 ? (
          diyTrips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start"
            />
          ))
        ) : (
          <div className="w-full py-8 text-center text-muted-foreground text-sm">
            No trips available yet.
          </div>
        )}
      </div>
    </section>
  );
}
