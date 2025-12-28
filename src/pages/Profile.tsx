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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";

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
      <div className="py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-muted overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Ahmad Razak</h1>
            <p className="text-muted-foreground text-sm">
              Kuala Lumpur, Malaysia
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>12 trips</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined Jan 2024</span>
            </div>
          </div>
          <Button variant="outline" className="rounded-full">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Bio */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-2">About Me</h3>
          <p className="text-sm text-muted-foreground">
            Passionate traveler who loves exploring new cultures and cuisines.
            Always looking for the next adventure! 🌍✈️
          </p>
        </Card>

        {/* Travel Style */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-3">Travel Style</h3>
          <div className="flex flex-wrap gap-2">
            {travelStyles.map((style) => (
              <PillChip key={style} label={style} />
            ))}
          </div>
        </Card>

        {/* Budget Range */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground mb-2">Budget Range</h3>
          <p className="text-sm text-muted-foreground">
            RM 500 - RM 2,000 per trip
          </p>
        </Card>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Card className="p-4 border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-secondary">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="flex-1 font-medium text-foreground">
                      {item.label}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full rounded-xl text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </AppLayout>
  );
}