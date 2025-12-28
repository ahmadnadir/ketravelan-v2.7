import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Users, Plus, MessageCircle } from "lucide-react";
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
        <div className="container max-w-lg mx-auto px-4">
          <div className="flex items-center gap-3 h-14">
            <Link to={`/trip/${id}`}>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate">{trip.title}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{trip.destination}</span>
                <span>•</span>
                <Users className="h-3 w-3" />
                <span>{mockMembers.length} members</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="pb-3">
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
      <main className="flex-1 container max-w-lg mx-auto">
        {activeTab === "chat" && <TripChat />}
        {activeTab === "expenses" && <TripExpenses />}
        {activeTab === "notes" && <TripNotes />}
        {activeTab === "members" && <TripMembers />}
      </main>
    </div>
  );
}