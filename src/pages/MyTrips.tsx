import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { TripCard } from "@/components/shared/TripCard";
import { mockTrips } from "@/data/mockData";
import { Calendar, History, FileEdit } from "lucide-react";

export default function MyTrips() {
  const [tab, setTab] = useState("upcoming");

  // Filter trips based on lifecycle
  const { upcomingTrips, previousTrips, draftTrips } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: typeof mockTrips = [];
    const previous: typeof mockTrips = [];
    const draft: typeof mockTrips = [];

    mockTrips.forEach((trip) => {
      // Check if trip is a draft (has status field)
      if ((trip as any).status === "draft") {
        draft.push(trip);
        return;
      }

      // Parse end date - format is "Jan 15, 2025"
      const endDate = new Date(trip.endDate);
      
      if (endDate >= today) {
        upcoming.push(trip);
      } else {
        previous.push(trip);
      }
    });

    return { upcomingTrips: upcoming, previousTrips: previous, draftTrips: draft };
  }, []);

  const displayTrips = useMemo(() => {
    switch (tab) {
      case "upcoming":
        return upcomingTrips;
      case "previous":
        return previousTrips;
      case "draft":
        return draftTrips;
      default:
        return upcomingTrips;
    }
  }, [tab, upcomingTrips, previousTrips, draftTrips]);

  const getEmptyMessage = () => {
    switch (tab) {
      case "upcoming":
        return "No upcoming trips. Start exploring!";
      case "previous":
        return "No past trips yet";
      case "draft":
        return "No drafts. Create a trip to get started!";
      default:
        return "No trips found";
    }
  };

  const getEmptyIcon = () => {
    switch (tab) {
      case "upcoming":
        return <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />;
      case "previous":
        return <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />;
      case "draft":
        return <FileEdit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Trips</h1>

        <SegmentedControl
          options={[
            { label: "Upcoming", value: "upcoming", count: upcomingTrips.length },
            { label: "Previous", value: "previous", count: previousTrips.length },
            { label: "Draft", value: "draft", count: draftTrips.length },
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
            {getEmptyIcon()}
            <p className="text-muted-foreground">{getEmptyMessage()}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
