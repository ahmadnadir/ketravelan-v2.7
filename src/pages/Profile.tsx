import { useState, useRef } from "react";
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
  Settings,
  Coins,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PillChip } from "@/components/shared/PillChip";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { getTravelStyleEmoji } from "@/data/travelStyles";
import { useAuth } from "@/contexts/AuthContext";
import { currencies } from "@/lib/currencyUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TikTok icon component
const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Platform to icon mapping - includes TikTok
const platformIcons: Record<string, LucideIcon | typeof TikTok> = {
  instagram: Instagram,
  tiktok: TikTok,
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
  const { user } = useAuth();
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(userProfile.coverPhotoUrl);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const displayedStyles = userProfile.travelStyles.slice(0, 4);

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPhoto(url);
    }
  };

  const headerContent = (
    <header className="glass border-b border-border/50">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14">
          <h1 className="font-semibold text-foreground">Profile</h1>
          <Link
            to="/settings"
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );

  const footerContent = (
    <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 safe-bottom">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-3">
        <Link to="/profile/edit" className="block">
          <Button size="lg" className="w-full rounded-xl">Edit Profile</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <FocusedFlowLayout headerContent={headerContent} footerContent={footerContent} showBottomNav={true}>
      {/* Hidden file input for cover photo */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverPhotoChange}
        className="hidden"
      />

      {/* Cover Photo Banner */}
      <div className="relative group">
        <div className="h-32 sm:h-40 w-full bg-muted overflow-hidden">
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
        </div>
        {/* Edit Cover button */}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Camera className="h-4 w-4" />
            Edit Cover
          </div>
        </button>

        {/* Avatar - Centered, overlapping cover */}
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col items-center -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-3 pb-6">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 space-y-4">
          {/* Profile Header - Identity */}
          <div className="flex flex-col items-center text-center space-y-1">
            <h2 className="text-xl font-bold text-foreground">{userProfile.name}</h2>
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{userProfile.location}</span>
            </div>

            {/* Social Links - Centered row */}
            {userProfile.socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
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
                  <PillChip key={style} label={style} icon={getTravelStyleEmoji(style)} size="sm" />
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

          {/* Home Currency (visible only to profile owner) */}
          {user?.homeCurrency && (
            <Card className="p-4 border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Home Currency</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currencies.find(c => c.code === user.homeCurrency)?.symbol} {user.homeCurrency}
                </span>
              </div>
            </Card>
          )}

          {/* Travel Styles Modal */}
          <Dialog open={showAllStyles} onOpenChange={setShowAllStyles}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
              <DialogHeader className="text-center">
                <DialogTitle className="text-center">Travel Style</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 pt-2">
                {userProfile.travelStyles.map((style) => (
                  <PillChip key={style} label={style} icon={getTravelStyleEmoji(style)} />
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
      </div>
    </FocusedFlowLayout>
  );
}
