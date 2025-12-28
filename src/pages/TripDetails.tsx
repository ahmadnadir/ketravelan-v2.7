import { useState } from "react";
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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { PillChip } from "@/components/shared/PillChip";
import { AvatarRow } from "@/components/shared/AvatarRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockTrips, mockMembers } from "@/data/mockData";

const iconMap: Record<string, any> = {
  car: Car,
  bed: Bed,
  utensils: Utensils,
  ticket: Ticket,
};

export default function TripDetails() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];

  const images = [
    trip.imageUrl,
    "https://images.unsplash.com/photo-1516571137133-1be29e37143a?w=800",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AppLayout hideHeader>
      <div className="pb-24">
        {/* Image Gallery */}
        <div className="relative -mx-4 -mt-0">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={images[currentImage]}
              alt={trip.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Back Button */}
          <Link
            to="/explore"
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
            <button className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Heart className="h-5 w-5 text-foreground" />
            </button>
            <button className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
              <Expand className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-12 w-16 rounded-lg overflow-hidden border-2 ${
                  index === currentImage ? "border-white" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pt-6 space-y-6">
          {/* Title & Location */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">{trip.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{trip.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="text-sm">{trip.totalSlots - trip.slotsLeft}/{trip.totalSlots} joined</span>
              </div>
            </div>

            {/* Members Preview */}
            <AvatarRow avatars={mockMembers} max={4} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <PillChip key={tag} label={tag} />
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Link to={`/trip/${id}/hub`} className="flex-1">
              <Button size="lg" className="w-full rounded-xl">
                Request to Join
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl">
              <MessageCircle className="h-5 w-5" />
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
            <div className="space-y-4">
              {/* Description */}
              <Card className="p-4 border-border/50">
                <h3 className="font-semibold text-foreground mb-2">About This Trip</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {trip.description}
                </p>
              </Card>

              {/* Requirements */}
              <Card className="p-4 border-border/50">
                <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {trip.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Budget Breakdown */}
              <Card className="p-4 border-border/50">
                <h3 className="font-semibold text-foreground mb-3">Budget Breakdown</h3>
                <div className="space-y-3">
                  {trip.budgetBreakdown.map((item) => {
                    const Icon = iconMap[item.icon] || Ticket;
                    return (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-foreground">{item.category}</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          RM {item.amount}
                        </span>
                      </div>
                    );
                  })}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total per person</span>
                    <span className="text-lg font-bold text-primary">
                      RM {trip.price}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "itinerary" && (
            <Card className="p-4 border-border/50">
              <p className="text-center text-muted-foreground py-8">
                Itinerary will be shared after joining
              </p>
            </Card>
          )}

          {activeTab === "members" && (
            <div className="space-y-3">
              {mockMembers.map((member) => (
                <Card key={member.id} className="p-4 border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground font-medium">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <Button variant="outline" size="sm">
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