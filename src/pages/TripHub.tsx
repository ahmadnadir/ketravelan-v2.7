import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Users } from "lucide-react";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Button } from "@/components/ui/button";
import { mockTrips, mockMembers } from "@/data/mockData";
import { TripChat } from "@/components/trip-hub/TripChat";
import { TripExpenses } from "@/components/trip-hub/TripExpenses";
import { TripNotes } from "@/components/trip-hub/TripNotes";
import { TripMembers } from "@/components/trip-hub/TripMembers";

export default function TripHub() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("chat");

  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14">
            <Link to={`/trip/${id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate text-sm sm:text-base">{trip.title}</h1>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <span className="truncate">{trip.destination}</span>
                <span>•</span>
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <span>{mockMembers.length}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pb-2 sm:pb-3">
            <SegmentedControl
              options={[
                { label: "Chat", value: "chat" },
                { label: "Expenses", value: "expenses" },
                { label: "Notes", value: "notes" },
                { label: "Members", value: "members" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
        {activeTab === "chat" && <TripChat />}
        {activeTab === "expenses" && <TripExpenses />}
        {activeTab === "notes" && <TripNotes />}
        {activeTab === "members" && <TripMembers />}
      </main>
    </div>
  );
}
