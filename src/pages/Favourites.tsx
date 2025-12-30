import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { mockTrips } from "@/data/mockData";
import { Heart } from "lucide-react";

// Simulated favourites - in a real app this would come from user state/database
const favouriteTripIds = ["1", "3", "5"];

export default function Favourites() {
  const favouriteTrips = useMemo(() => {
    return mockTrips.filter((trip) => favouriteTripIds.includes(trip.id));
  }, []);

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Favourites</h1>
          <p className="text-sm text-muted-foreground">
            Trips you've saved for later
          </p>
        </div>

        {favouriteTrips.length > 0 ? (
          <div className="space-y-4">
            {favouriteTrips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No favourites yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Tap the heart icon on any trip to save it here for easy access later.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
