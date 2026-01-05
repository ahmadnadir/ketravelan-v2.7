import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, MapPin, Users } from "lucide-react";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { Button } from "@/components/ui/button";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { mockTrips, mockMembers } from "@/data/mockData";
import { TripChat } from "@/components/trip-hub/TripChat";
import { TripExpenses } from "@/components/trip-hub/TripExpenses";
import { TripNotes } from "@/components/trip-hub/TripNotes";
import { GroupInfoModal } from "@/components/trip-hub/GroupInfoModal";
import { getPublishedTripById } from "@/lib/publishedTrips";
import { CurrencyCode } from "@/lib/currencyUtils";

export default function TripHub() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const [travelCurrencies, setTravelCurrencies] = useState<CurrencyCode[]>([]);

  // Read tab from URL query param on mount
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "expenses" || tabParam === "notes" || tabParam === "chat") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Load published trip data to get travel currencies
  useEffect(() => {
    if (id) {
      const publishedTrip = getPublishedTripById(id);
      if (publishedTrip?.travelCurrencies) {
        setTravelCurrencies(publishedTrip.travelCurrencies);
      }
    }
  }, [id]);

  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];

  const headerContent = (
    <header className="glass border-b border-border/50 safe-top">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14">
          <Link to={activeTab === "expenses" ? "/expenses" : "/chat"}>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          
          {/* Interactive Trip Header - Opens Group Info Modal */}
          <button
            onClick={() => setGroupInfoOpen(true)}
            className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
          >
            {/* Circular Trip Image */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden shrink-0 border-2 border-background shadow-sm">
              <img
                src={trip.imageUrl}
                alt={trip.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
            <h1 className="font-semibold text-foreground truncate text-base sm:text-lg">{trip.title}</h1>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span className="truncate">{trip.destination}</span>
                <span>•</span>
                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span>{mockMembers.length}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Tabs - Chat, Expenses, Notes */}
        <div className="pb-2 sm:pb-3">
          <SegmentedControl
            options={[
              { label: "Chat", value: "chat" },
              { label: "Expenses", value: "expenses" },
              { label: "Notes", value: "notes" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>
    </header>
  );

  return (
    <>
      <FocusedFlowLayout headerContent={headerContent} showBottomNav={true}>
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          {activeTab === "chat" && <TripChat />}
          {activeTab === "expenses" && <TripExpenses allowedCurrencies={travelCurrencies.length > 0 ? travelCurrencies : undefined} />}
          {activeTab === "notes" && <TripNotes tripId={id || "1"} />}
        </div>
      </FocusedFlowLayout>

      {/* Group Info Modal */}
      <GroupInfoModal
        open={groupInfoOpen}
        onOpenChange={setGroupInfoOpen}
        trip={trip}
        members={mockMembers}
      />
    </>
  );
}
