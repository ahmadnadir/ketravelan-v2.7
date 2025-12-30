import { Bell, User, FileText, Settings, LogOut, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
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
            <Bell className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          
          {/* Profile Modal */}
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm mx-4 rounded-2xl">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-center">Account</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-1">
                {/* Profile */}
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                
                {/* Favourites (NEW) */}
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
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
