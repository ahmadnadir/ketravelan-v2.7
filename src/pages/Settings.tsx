import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  HelpCircle,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

const SettingItem = ({ icon, label, description, onClick, trailing, destructive }: SettingItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left ${
      destructive ? "text-destructive" : ""
    }`}
  >
    <div className={`${destructive ? "text-destructive" : "text-muted-foreground"}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${destructive ? "text-destructive" : "text-foreground"}`}>
        {label}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      )}
    </div>
    {trailing || <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
  </button>
);

export default function Settings() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);
  
  // Privacy settings state
  const [profileVisible, setProfileVisible] = useState(true);
  const [showTripsPublicly, setShowTripsPublicly] = useState(false);

  const handleLogout = () => {
    // In a real app, this would call supabase.auth.signOut()
    toast.success("Logged out successfully");
    setShowLogoutDialog(false);
    navigate("/");
  };

  const headerContent = (
    <header className="glass border-b border-border/50">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-foreground">Settings</h1>
        </div>
      </div>
    </header>
  );

  return (
    <FocusedFlowLayout headerContent={headerContent} showBottomNav={true}>
      <div className="pt-4 pb-6">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 space-y-4">
          {/* Notifications Section */}
          <Card className="overflow-hidden border-border/50">
            <div className="px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Notifications</h2>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              <SettingItem
                icon={<Bell className="h-5 w-5" />}
                label="Push Notifications"
                description="Receive alerts on your device"
                trailing={
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                onClick={() => setPushNotifications(!pushNotifications)}
              />
              <SettingItem
                icon={<MessageSquare className="h-5 w-5" />}
                label="Email Notifications"
                description="Get updates via email"
                trailing={
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                onClick={() => setEmailNotifications(!emailNotifications)}
              />
              <SettingItem
                icon={<Bell className="h-5 w-5" />}
                label="Trip Reminders"
                description="Reminders before your trips"
                trailing={
                  <Switch
                    checked={tripReminders}
                    onCheckedChange={setTripReminders}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                onClick={() => setTripReminders(!tripReminders)}
              />
            </div>
          </Card>

          {/* Privacy Section */}
          <Card className="overflow-hidden border-border/50">
            <div className="px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Privacy</h2>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              <SettingItem
                icon={<Shield className="h-5 w-5" />}
                label="Profile Visibility"
                description="Allow others to view your profile"
                trailing={
                  <Switch
                    checked={profileVisible}
                    onCheckedChange={setProfileVisible}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                onClick={() => setProfileVisible(!profileVisible)}
              />
              <SettingItem
                icon={<Globe className="h-5 w-5" />}
                label="Show Trips Publicly"
                description="Display your trips on your profile"
                trailing={
                  <Switch
                    checked={showTripsPublicly}
                    onCheckedChange={setShowTripsPublicly}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                onClick={() => setShowTripsPublicly(!showTripsPublicly)}
              />
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="overflow-hidden border-border/50">
            <div className="px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Preferences</h2>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              <SettingItem
                icon={<Moon className="h-5 w-5" />}
                label="Appearance"
                description="Light, dark, or system theme"
                onClick={() => toast.info("Theme settings coming soon")}
              />
              <SettingItem
                icon={<Globe className="h-5 w-5" />}
                label="Language"
                description="English"
                onClick={() => toast.info("Language settings coming soon")}
              />
            </div>
          </Card>

          {/* Support Section */}
          <Card className="overflow-hidden border-border/50">
            <div className="px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Support</h2>
              </div>
            </div>
            <div className="divide-y divide-border/50">
              <SettingItem
                icon={<HelpCircle className="h-5 w-5" />}
                label="Help Center"
                description="FAQs and support articles"
                onClick={() => toast.info("Help Center coming soon")}
              />
              <SettingItem
                icon={<MessageSquare className="h-5 w-5" />}
                label="Send Feedback"
                onClick={() => navigate("/feedback")}
              />
              <SettingItem
                icon={<FileText className="h-5 w-5" />}
                label="Terms of Service"
                onClick={() => toast.info("Terms page coming soon")}
              />
              <SettingItem
                icon={<Shield className="h-5 w-5" />}
                label="Privacy Policy"
                onClick={() => toast.info("Privacy page coming soon")}
              />
            </div>
          </Card>

          <Separator className="my-2" />

          {/* Logout */}
          <Card className="overflow-hidden border-border/50">
            <SettingItem
              icon={<LogOut className="h-5 w-5" />}
              label="Log Out"
              onClick={() => setShowLogoutDialog(true)}
              destructive
              trailing={null}
            />
          </Card>

          {/* App Version */}
          <p className="text-center text-xs text-muted-foreground pt-4">
            Version 1.0.0
          </p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FocusedFlowLayout>
  );
}
