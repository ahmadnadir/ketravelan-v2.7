import { Home, Map, FileText, Heart, MessageSquare, Settings, LogOut, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface MenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Map, label: "My Trips", path: "/my-trips" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: FileText, label: "Approvals & Requests", path: "/approvals" },
  { icon: FileText, label: "Draft Trips", path: "/my-trips?tab=draft" },
  { icon: Heart, label: "Favourites", path: "/favourites" },
  { icon: MessageSquare, label: "Feedback", path: "/feedback" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function MenuDrawer({ open, onOpenChange }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleLogout = () => {
    onOpenChange(false);
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md px-4 sm:px-6">
        <SheetHeader>
          <SheetTitle asChild>
            <button
              onClick={() => handleNavigation("/profile")}
              className="flex items-center gap-3 text-base sm:text-lg hover:opacity-80 transition-opacity cursor-pointer w-full text-left"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <span>{user?.name || "Guest"}</span>
            </button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path + item.label}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* Separator */}
          <div className="h-px bg-border my-3" />
          
          {/* Log Out (destructive) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 transition-colors text-destructive text-left"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
