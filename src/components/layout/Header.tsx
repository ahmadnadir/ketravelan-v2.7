import { Search, Bell, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}

export function Header({ onMenuClick, onNotificationsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">K</span>
          </div>
          <span className="font-semibold text-foreground">Ketravelan</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative"
            onClick={onNotificationsClick}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onMenuClick}>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}