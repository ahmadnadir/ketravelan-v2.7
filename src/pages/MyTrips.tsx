import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { TripCard } from "@/components/shared/TripCard";
import { mockTrips } from "@/data/mockData";

export default function MyTrips() {
  const [tab, setTab] = useState("hosting");

  const hostingTrips = mockTrips.slice(0, 2);
  const joinedTrips = mockTrips.slice(2, 4);

  const displayTrips = tab === "hosting" ? hostingTrips : joinedTrips;

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Trips</h1>

        <SegmentedControl
          options={[
            { label: "Hosting", value: "hosting", count: hostingTrips.length },
            { label: "Joined", value: "joined", count: joinedTrips.length },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="space-y-4">
          {displayTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>

        {displayTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tab === "hosting"
                ? "You haven't created any trips yet"
                : "You haven't joined any trips yet"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}