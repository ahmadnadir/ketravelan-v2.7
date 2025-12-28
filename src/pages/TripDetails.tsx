import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  MapPin,
  Users,
  Share2,
  Heart,
  MessageCircle,
  Car,
  Bed,
  Utensils,
  Ticket,
  Calendar,
  Route,
  FileText,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { PillChip } from "@/components/shared/PillChip";
import { AvatarRow } from "@/components/shared/AvatarRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockTrips, mockMembers } from "@/data/mockData";
import { getPublishedTripById, PublishedTrip } from "@/lib/publishedTrips";

const iconMap: Record<string, any> = {
  car: Car,
  bed: Bed,
  utensils: Utensils,
  ticket: Ticket,
  transport: Car,
  accommodation: Bed,
  food: Utensils,
  activities: Ticket,
};

const travelStyles: Record<string, { label: string; icon: string }> = {
  outdoor: { label: "Outdoor & Adventure", icon: "🏔️" },
  diving: { label: "Diving & Water", icon: "🤿" },
  city: { label: "City & Urban", icon: "🏙️" },
  festival: { label: "Festival / Music", icon: "🎉" },
  crossborder: { label: "Cross-Border", icon: "🌍" },
  umrah: { label: "Umrah DIY", icon: "🕋" },
};

export default function TripDetails() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Try to load from published trips first, then fall back to mock data
  const publishedTrip = useMemo(() => id ? getPublishedTripById(id) : null, [id]);
  const mockTrip = mockTrips.find((t) => t.id === id) || mockTrips[0];

  // Determine if we're showing a published trip or mock trip
  const isPublishedTrip = !!publishedTrip;

  // Normalize data for display
  const tripData = useMemo(() => {
    if (publishedTrip) {
      // Calculate total budget
      let totalBudget = 0;
      let budgetBreakdown: { category: string; amount: number; icon: string }[] = [];
      
      if (publishedTrip.budgetType === 'rough') {
        totalBudget = publishedTrip.roughBudgetTotal;
        budgetBreakdown = publishedTrip.roughBudgetCategories.map(cat => ({
          category: cat.charAt(0).toUpperCase() + cat.slice(1),
          amount: Math.round(publishedTrip.roughBudgetTotal / publishedTrip.roughBudgetCategories.length),
          icon: cat.toLowerCase(),
        }));
      } else if (publishedTrip.budgetType === 'detailed') {
        totalBudget = Object.values(publishedTrip.detailedBudget).reduce((a, b) => a + b, 0);
        budgetBreakdown = Object.entries(publishedTrip.detailedBudget).map(([cat, amount]) => ({
          category: cat.charAt(0).toUpperCase() + cat.slice(1),
          amount,
          icon: cat.toLowerCase(),
        }));
      }

      return {
        id: publishedTrip.id,
        title: publishedTrip.title,
        destination: publishedTrip.primaryDestination,
        additionalStops: publishedTrip.additionalStops,
        description: `A ${publishedTrip.visibility} trip to ${publishedTrip.primaryDestination}${publishedTrip.additionalStops.length > 0 ? ` and ${publishedTrip.additionalStops.length} more stop${publishedTrip.additionalStops.length > 1 ? 's' : ''}` : ''}.`,
        tags: publishedTrip.travelStyles.map(s => travelStyles[s]?.label || s),
        requirements: publishedTrip.expectations,
        budgetBreakdown,
        price: totalBudget,
        totalSlots: publishedTrip.groupSizeType === 'set' ? publishedTrip.groupSize : 10,
        slotsLeft: publishedTrip.groupSizeType === 'set' ? publishedTrip.groupSize - 1 : 9,
        imageUrl: publishedTrip.coverImage || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        dateType: publishedTrip.dateType,
        startDate: publishedTrip.startDate,
        endDate: publishedTrip.endDate,
        itineraryType: publishedTrip.itineraryType,
        simpleNotes: publishedTrip.simpleNotes,
        dayByDayPlan: publishedTrip.dayByDayPlan,
        visibility: publishedTrip.visibility,
        travelStyleIds: publishedTrip.travelStyles,
      };
    } else {
      return {
        ...mockTrip,
        additionalStops: [],
        dateType: 'flexible' as const,
        startDate: '',
        endDate: '',
        itineraryType: 'skip' as const,
        simpleNotes: '',
        dayByDayPlan: [],
        visibility: 'public' as const,
        travelStyleIds: [],
      };
    }
  }, [publishedTrip, mockTrip]);

  const images = [
    tripData.imageUrl,
    "https://images.unsplash.com/photo-1516571137133-1be29e37143a?w=800",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AppLayout hideHeader>
      <div className="pb-24">
        {/* Image Gallery */}
        <div className="relative -mx-4 sm:-mx-6">
          <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
            <img
              src={images[currentImage]}
              alt={tripData.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Back Button */}
          <Link
            to="/explore"
            className="absolute top-3 sm:top-4 left-3 sm:left-4 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </Link>

          {/* Actions */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1.5 sm:gap-2">
            <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </button>
            <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </button>
            <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Expand className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 max-w-[80%] overflow-x-auto scrollbar-hide">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-10 w-14 sm:h-12 sm:w-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                  index === currentImage ? "border-white" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
          {/* Title & Location */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{tripData.title}</h1>
              {isPublishedTrip && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${
                  tripData.visibility === 'public' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {tripData.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{tripData.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{tripData.totalSlots - tripData.slotsLeft}/{tripData.totalSlots} joined</span>
              </div>
              {isPublishedTrip && tripData.dateType === 'exact' && tripData.startDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">
                    {new Date(tripData.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {tripData.endDate && ` - ${new Date(tripData.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </span>
                </div>
              )}
            </div>

            {/* Route display for published trips */}
            {isPublishedTrip && tripData.additionalStops.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <Route className="h-3.5 w-3.5 text-primary" />
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {tripData.destination}
                </span>
                {tripData.additionalStops.map((stop, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="text-muted-foreground">→</span>
                    <span className="px-2 py-1 bg-secondary text-foreground rounded-full">
                      {stop}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {/* Members Preview */}
            <AvatarRow avatars={mockMembers} max={4} />

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tripData.tags.map((tag) => (
                <PillChip key={tag} label={tag} />
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2 sm:gap-3">
            <Link to={`/trip/${id}/hub`} className="flex-1">
              <Button size="lg" className="w-full rounded-xl text-sm sm:text-base">
                Request to Join
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl shrink-0">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <SegmentedControl
            options={[
              { label: "Overview", value: "overview" },
              { label: "Itinerary", value: "itinerary" },
              { label: "Members", value: "members" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-3 sm:space-y-4">
              {/* Description */}
              <Card className="p-3 sm:p-4 border-border/50">
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">About This Trip</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {tripData.description}
                </p>
              </Card>

              {/* Requirements */}
              {tripData.requirements.length > 0 && (
                <Card className="p-3 sm:p-4 border-border/50">
                  <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Requirements / What to Expect</h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {tripData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Budget Breakdown */}
              {tripData.budgetBreakdown.length > 0 && (
                <Card className="p-3 sm:p-4 border-border/50">
                  <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Budget Breakdown</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {tripData.budgetBreakdown.map((item) => {
                      const Icon = iconMap[item.icon] || Ticket;
                      return (
                        <div key={item.category} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-secondary flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            </div>
                            <span className="text-xs sm:text-sm text-foreground truncate">{item.category}</span>
                          </div>
                          <span className="font-semibold text-foreground text-sm sm:text-base shrink-0">
                            RM {item.amount}
                          </span>
                        </div>
                      );
                    })}
                    <div className="pt-2 sm:pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm sm:text-base">Total per person</span>
                      <span className="text-base sm:text-lg font-bold text-primary">
                        RM {tripData.price}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {/* No budget set message */}
              {tripData.budgetBreakdown.length === 0 && isPublishedTrip && (
                <Card className="p-3 sm:p-4 border-border/50">
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Budget</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Budget will be discussed in the group
                  </p>
                </Card>
              )}
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="space-y-3 sm:space-y-4">
              {/* Notes-based itinerary */}
              {tripData.itineraryType === 'notes' && tripData.simpleNotes && (
                <Card className="p-3 sm:p-4 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Trip Notes</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {tripData.simpleNotes}
                  </p>
                </Card>
              )}

              {/* Day-by-day itinerary */}
              {tripData.itineraryType === 'dayByDay' && tripData.dayByDayPlan.length > 0 && (
                <div className="space-y-3">
                  {tripData.dayByDayPlan.map((day, index) => (
                    <Card key={index} className="p-3 sm:p-4 border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{day.day}</span>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">
                          Day {day.day}
                        </h3>
                      </div>
                      {day.activities.length > 0 ? (
                        <ul className="space-y-1.5 sm:space-y-2 pl-10">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-muted-foreground pl-10">
                          No activities planned yet
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {(!isPublishedTrip || tripData.itineraryType === 'skip' || 
                (tripData.itineraryType === 'notes' && !tripData.simpleNotes) ||
                (tripData.itineraryType === 'dayByDay' && tripData.dayByDayPlan.length === 0)) && (
                <Card className="p-4 border-border/50">
                  <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">
                    {isPublishedTrip 
                      ? "Itinerary will be finalized in the group chat"
                      : "Itinerary will be shared after joining"}
                  </p>
                </Card>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-2 sm:space-y-3">
              {mockMembers.map((member) => (
                <Card key={member.id} className="p-3 sm:p-4 border-border/50">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted overflow-hidden shrink-0">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground font-medium text-sm sm:text-base">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">{member.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 text-xs sm:text-sm">
                      Message
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
