import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Camera,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  Ghost,
  AtSign,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PillChip } from "@/components/shared/PillChip";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { tripCategories } from "@/data/categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper to find category icon by label
const getCategoryIcon = (styleLabel: string): string | undefined => {
  const category = tripCategories.find(
    (cat) => cat.label.toLowerCase() === styleLabel.toLowerCase()
  );
  return category?.icon;
};

// Platform to icon mapping
const platformIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  snapchat: Ghost,
  x: Twitter,
  threads: AtSign,
  linkedin: Linkedin,
};

// Mock user profile data (current logged-in user)
const userProfile = {
  name: "Ahmad Razak",
  location: "Kuala Lumpur, Malaysia",
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  coverPhotoUrl: null as string | null,
  bio: "Passionate traveler who loves exploring new cultures and cuisines. Always looking for the next adventure! 🌍✈️",
  stats: { tripsCount: 12, countriesCount: 8 },
  travelStyles: ["Adventure", "Budget-friendly", "Nature", "Food", "Culture", "Photography"],
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com/ahmadrazak" },
    { platform: "youtube", url: "https://youtube.com/@ahmadtravels" },
    { platform: "linkedin", url: "https://linkedin.com/in/ahmadrazak" },
  ],
  previousTrips: [
    {
      id: "langkawi-trip",
      title: "Island Hopping Paradise",
      destination: "Langkawi",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      date: "Dec 2024",
    },
    {
      id: "cameron-trip",
      title: "Highland Retreat",
      destination: "Cameron Highlands",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      date: "Nov 2024",
    },
  ],
};

// AboutText component with Read more/less functionality
const AboutText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;
  const shouldTruncate = text.length > maxLength;

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {shouldTruncate && !isExpanded ? `${text.slice(0, maxLength)}...` : text}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary font-medium mt-1"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const [showAllStyles, setShowAllStyles] = useState(false);

  const displayedStyles = userProfile.travelStyles.slice(0, 4);

  const headerContent = (
    <div className="flex items-center justify-between w-full px-4 py-3 border-b border-border/50 bg-background">
      <span className="text-base font-semibold">Profile</span>
    </div>
  );

  const footerContent = (
    <div className="p-4 border-t border-border/50 bg-background">
      <Link to="/profile/edit" className="block">
        <Button className="w-full rounded-xl">Edit Profile</Button>
      </Link>
    </div>
  );

  return (
    <FocusedFlowLayout headerContent={headerContent} footerContent={footerContent}>
      <div className="space-y-4">
        {/* Cover Photo Banner */}
        <div className="relative group -mx-4 -mt-4">
          <div className="h-32 sm:h-40 w-full bg-muted overflow-hidden">
            {userProfile.coverPhotoUrl ? (
              <img
                src={userProfile.coverPhotoUrl}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
            )}
          </div>
          {/* Edit Cover button */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <Camera className="h-4 w-4" />
              Edit Cover
            </div>
          </button>
          {/* Avatar */}
          <div className="absolute -bottom-12 left-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Spacer for avatar overlap */}
        <div className="h-8" />

        {/* Name, Location & Social Links */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            <span>{userProfile.location}</span>
          </div>

          {/* Social Links */}
          {userProfile.socialLinks.length > 0 && (
            <div className="flex items-center gap-3 pt-1">
              {userProfile.socialLinks.map((link) => {
                const Icon = platformIcons[link.platform];
                if (!Icon) return null;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center border-border/50">
            <p className="text-xl font-bold text-foreground">{userProfile.stats.tripsCount}</p>
            <p className="text-xs text-muted-foreground">Trips</p>
          </Card>
          <Card className="p-3 text-center border-border/50">
            <p className="text-xl font-bold text-foreground">{userProfile.stats.countriesCount}</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </Card>
        </div>

        {/* About Me */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-2 text-sm">About Me</h3>
          <AboutText text={userProfile.bio} />
        </Card>

        {/* Travel Style */}
        {userProfile.travelStyles.length > 0 && (
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Travel Style</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {displayedStyles.map((style) => (
                <PillChip key={style} label={style} icon={getCategoryIcon(style)} size="sm" />
              ))}
              {userProfile.travelStyles.length > 4 && (
                <button
                  onClick={() => setShowAllStyles(true)}
                  className="inline-flex items-center px-2 py-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  +{userProfile.travelStyles.length - 4} more
                </button>
              )}
            </div>
          </Card>
        )}

        {/* Travel Styles Modal */}
        <Dialog open={showAllStyles} onOpenChange={setShowAllStyles}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Travel Style</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 pt-2">
              {userProfile.travelStyles.map((style) => (
                <PillChip key={style} label={style} icon={getCategoryIcon(style)} />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Previous Trips */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Previous Trips</h3>
          <div className="space-y-3">
            {userProfile.previousTrips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`}>
                <Card className="overflow-hidden border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex gap-3 p-3">
                    <div className="h-16 w-20 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {trip.title}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {trip.destination}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{trip.date}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </FocusedFlowLayout>
  );
}
