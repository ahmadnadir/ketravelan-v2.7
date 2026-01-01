import { Bell, User, FileText, Settings, LogOut, Heart, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}

export function Header({ onNotificationsClick }: HeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm sm:text-base">K</span>
          </div>
          <span className="font-semibold text-foreground text-sm sm:text-base">Ketravelan</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 relative"
            onClick={onNotificationsClick}
          >
            <Bell className="h-6 w-6 sm:h-6 sm:w-6 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          
          {/* Profile Sheet */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md px-4 sm:px-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-4 sm:mt-6 space-y-1">
                {/* Profile */}
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                
                {/* Favourites */}
                <button
                  onClick={() => handleNavigation("/favourites")}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <Heart className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Favourites</span>
                </button>
                
                {/* Approvals & Requests */}
                <button
                  onClick={() => handleNavigation("/approvals")}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Approvals & Requests</span>
                </button>
                
                {/* Draft Trips */}
                <button
                  onClick={() => handleNavigation("/my-trips?tab=draft")}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Draft Trips</span>
                </button>
                
                {/* Settings */}
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                
                {/* Separator */}
                <div className="h-px bg-border my-2" />
                
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
        </div>
      </div>
    </header>
  );
}
