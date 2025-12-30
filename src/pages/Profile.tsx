import { Link } from "react-router-dom";
import {
  User,
  Settings,
  ChevronRight,
  MapPin,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Ghost,
  AtSign,
  type LucideIcon,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";

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

// Mock social links data - only show platforms user has added
const socialLinks = [
  { platform: "instagram", url: "https://instagram.com/ahmadrazak" },
  { platform: "youtube", url: "https://youtube.com/@ahmadtravels" },
  { platform: "linkedin", url: "https://linkedin.com/in/ahmadrazak" },
];

const menuItems = [
  { icon: User, label: "Edit Profile", path: "/profile/edit" },
  { icon: CreditCard, label: "Payment Methods", path: "/profile/payments" },
  { icon: Bell, label: "Notifications", path: "/profile/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/profile/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/profile/help" },
];

const travelStyles = ["Adventure", "Budget-friendly", "Nature", "Food"];

export default function Profile() {
  return (
    <AppLayout>
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Ahmad Razak</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Kuala Lumpur, Malaysia
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>12 trips</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Joined Jan 2024</span>
            </div>
          </div>
          <Link to="/profile/edit">
            <Button variant="outline" className="rounded-full text-sm">
              <Settings className="h-4 w-4 mr-1.5 sm:mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Bio */}
        <Card className="p-3 sm:p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">About Me</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Passionate traveler who loves exploring new cultures and cuisines.
            Always looking for the next adventure! 🌍✈️
          </p>
        </Card>

        {/* Travel Style */}
        <Card className="p-3 sm:p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Travel Style</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {travelStyles.map((style) => (
              <PillChip key={style} label={style} />
            ))}
          </div>
        </Card>

        {/* Social Links - Show only if user has links */}
        {socialLinks.length > 0 && (
          <Card className="p-3 sm:p-4 border-border/50">
            <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = platformIcons[link.platform];
                if (!Icon) return null;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    aria-label={link.platform}
                  >
                    <Icon className="h-5 w-5 text-foreground" />
                  </a>
                );
              })}
            </div>
          </Card>
        )}

        {/* Budget Range */}
        <Card className="p-3 sm:p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">Budget Range</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            RM 500 - RM 2,000 per trip
          </p>
        </Card>

        {/* Menu */}
        <div className="space-y-1.5 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Card className="p-3 sm:p-4 border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-secondary shrink-0">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <span className="flex-1 font-medium text-foreground text-sm sm:text-base">
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full rounded-xl text-destructive hover:text-destructive text-sm sm:text-base"
        >
          <LogOut className="h-4 w-4 mr-1.5 sm:mr-2" />
          Log Out
        </Button>
      </div>
    </AppLayout>
  );
}
