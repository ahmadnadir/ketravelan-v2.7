import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
}

export function Header({ onNotificationsClick, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="z-50 glass border-b border-border/50 pt-safe">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm sm:text-base">K</span>
          </div>
          <span className="font-semibold text-foreground text-sm sm:text-base">Ketravelan</span>
        </Link>

        {/* Right Actions - Conditional based on auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            // Logged in: Show notifications and menu
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 sm:h-10 sm:w-10 relative"
                onClick={onNotificationsClick}
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 sm:h-10 sm:w-10"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </Button>
            </>
          ) : (
            // Logged out: Show Sign Up / Log In buttons
            <>
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-full text-sm font-medium"
                onClick={() => navigate("/auth?mode=login")}
              >
                Log In
              </Button>
              <Button 
                size="sm"
                className="rounded-full text-sm font-medium"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
