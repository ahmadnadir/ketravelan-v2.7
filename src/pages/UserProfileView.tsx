import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Star, MessageCircle, Instagram, Youtube, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PillChip } from "@/components/shared/PillChip";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockUserProfiles } from "@/data/mockData";

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  website: Globe,
};

export default function UserProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const profile = mockUserProfiles[userId || "1"] || mockUserProfiles["1"];

  const handleMessage = () => {
    // Navigate to direct chat with this user
    navigate(`/chat/dm-${userId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-3 h-14">
            <button onClick={() => navigate(-1)}>
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </div>
            </button>
            <h1 className="font-semibold text-foreground">Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback className="text-2xl font-semibold">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            {profile.location && (
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center border-border/50">
            <p className="text-xl font-bold text-foreground">{profile.stats.tripsCount}</p>
            <p className="text-xs text-muted-foreground">Trips</p>
          </Card>
          <Card className="p-3 text-center border-border/50">
            <p className="text-xl font-bold text-foreground">{profile.stats.countriesCount}</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </Card>
          <Card className="p-3 text-center border-border/50">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <p className="text-xl font-bold text-foreground">{profile.stats.rating || "—"}</p>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </Card>
        </div>

        {/* About Section */}
        {profile.bio && (
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-2">About Me</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
          </Card>
        )}

        {/* Travel Style Tags */}
        {profile.travelStyles.length > 0 && (
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-3">Travel Style</h3>
            <div className="flex flex-wrap gap-2">
              {profile.travelStyles.map((style) => (
                <PillChip key={style} label={style} />
              ))}
            </div>
          </Card>
        )}

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-3">Social Links</h3>
            <div className="flex gap-3">
              {profile.socialLinks.map((link) => {
                const Icon = socialIcons[link.platform] || Globe;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </a>
                );
              })}
            </div>
          </Card>
        )}

        {/* Previous Trips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Previous Trips</h3>
            <span className="text-xs text-muted-foreground">
              {profile.previousTrips.length} trips · {profile.stats.countriesCount} countries
            </span>
          </div>

          {profile.previousTrips.length > 0 ? (
            <div className="space-y-3">
              {profile.previousTrips.map((trip) => (
                <Link key={trip.id} to={`/trip/${trip.id}`}>
                  <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex gap-3 p-3">
                      <div className="h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img
                          src={trip.imageUrl}
                          alt={trip.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">{trip.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{trip.destination}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-muted-foreground">
                            {trip.startDate} - {trip.endDate}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            trip.tripType === "diy" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-secondary text-muted-foreground"
                          }`}>
                            {trip.tripType === "diy" ? "DIY" : "Guided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border-border/50">
              <p className="text-sm text-muted-foreground">No trips yet</p>
            </Card>
          )}
        </div>
      </main>

      {/* Sticky Message Button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 safe-bottom">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-3">
          <Button size="lg" className="w-full rounded-xl" onClick={handleMessage}>
            <MessageCircle className="h-5 w-5 mr-2" />
            Message {profile.name.split(" ")[0]}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
