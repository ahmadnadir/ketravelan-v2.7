import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, MessageCircle, Instagram, Youtube, Linkedin, Globe, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PillChip } from "@/components/shared/PillChip";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { mockUserProfiles } from "@/data/mockData";
import { tripCategories } from "@/data/categories";

// Helper to find category icon by label
const getCategoryIcon = (styleLabel: string): string | undefined => {
  const category = tripCategories.find(
    (cat) => cat.label.toLowerCase() === styleLabel.toLowerCase()
  );
  return category?.icon;
};

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  website: Globe,
};

// About text component with truncation
const AboutText = ({ bio }: { bio: string }) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = bio.length > 150;

  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {shouldTruncate && !expanded ? `${bio.slice(0, 150)}...` : bio}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary font-medium mt-1"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default function UserProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const profile = mockUserProfiles[userId || "1"] || mockUserProfiles["1"];
  
  // Mock: Check if this is the current user's profile (for demo, user "1" is the logged-in user)
  const isOwnProfile = userId === "1" || !userId;

  const handleMessage = () => {
    // Navigate to direct chat with this user
    navigate(`/chat/dm-${userId}`);
  };

  const handleEditCover = () => {
    // TODO: Implement cover photo upload
    console.log("Edit cover photo clicked");
  };

  const headerContent = (
    <header className="glass border-b border-border/50">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 h-14">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-secondary"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="font-semibold text-foreground">Profile</h1>
        </div>
      </div>
    </header>
  );

  const footerContent = (
    <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 safe-bottom">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-3">
        <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleMessage}>
          <MessageCircle className="h-5 w-5" />
          Message {profile.name.split(" ")[0]}
        </Button>
      </div>
    </div>
  );

  return (
    <FocusedFlowLayout
      headerContent={headerContent}
      footerContent={footerContent}
      showBottomNav={true}
    >
      {/* Cover Photo Banner */}
      <div className="relative group">
        <div className="h-32 sm:h-40 w-full bg-muted overflow-hidden">
          {profile.coverPhotoUrl ? (
            <img
              src={profile.coverPhotoUrl}
              alt={`${profile.name}'s cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
        </div>
        {/* Edit cover photo button - only visible on own profile */}
        {isOwnProfile && (
          <button
            onClick={handleEditCover}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 text-foreground text-sm font-medium shadow-lg">
              <Camera className="h-4 w-4" />
              <span>Edit Cover</span>
            </div>
          </button>
        )}
        {/* Avatar overlapping cover */}
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col items-center -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile.imageUrl} alt={profile.name} />
              <AvatarFallback className="text-2xl font-semibold">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-3 pb-6">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 space-y-6">
          {/* Profile Header - Identity First */}
          <div className="flex flex-col items-center text-center space-y-1">
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            {profile.location && (
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            
            {/* Social Links - Icon Row (under name/location) */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {profile.socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform] || Globe;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-full bg-secondary/60 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 text-center border-border/50">
              <p className="text-xl font-bold text-foreground">{profile.stats.tripsCount}</p>
              <p className="text-xs text-muted-foreground">Trips</p>
            </Card>
            <Card className="p-3 text-center border-border/50">
              <p className="text-xl font-bold text-foreground">{profile.stats.countriesCount}</p>
              <p className="text-xs text-muted-foreground">Countries</p>
            </Card>
          </div>

          {/* About Section */}
          {profile.bio && (
            <Card className="p-4 border-border/50">
              <h3 className="font-semibold text-foreground mb-2">About Me</h3>
              <AboutText bio={profile.bio} />
            </Card>
          )}

          {/* Travel Style Tags */}
          {profile.travelStyles.length > 0 && (
            <Card className="p-3 border-border/50">
              <h3 className="font-semibold text-foreground mb-2">Travel Style</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.travelStyles.slice(0, 4).map((style) => (
                  <PillChip key={style} label={style} icon={getCategoryIcon(style)} size="sm" />
                ))}
                {profile.travelStyles.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground">
                    +{profile.travelStyles.length - 4} more
                  </span>
                )}
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
        </div>
      </div>
    </FocusedFlowLayout>
  );
}
