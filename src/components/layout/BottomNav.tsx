import { Compass, PlusCircle, MessageCircle, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isPrimary?: boolean;
  isAvatar?: boolean;
}

const navItems: NavItem[] = [
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: PlusCircle, label: "Create", path: "/create", isPrimary: true },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { label: "Profile", path: "/profile", isAvatar: true },
];

interface BottomNavProps {
  inline?: boolean;
  onAvatarClick?: () => void;
}

export function BottomNav({ inline = false, onAvatarClick }: BottomNavProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Hide bottom nav for logged-out users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={cn(
      "z-50 glass border-t border-border/50 safe-bottom transition-all duration-300",
      inline ? "" : "fixed bottom-0 left-0 right-0"
    )}>
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-16 sm:h-18">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));

            // Render avatar for profile
            if (item.isAvatar) {
              return (
                <button
                  key="avatar"
                  onClick={onAvatarClick}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-2 rounded-xl transition-colors min-w-0",
                    isActive 
                      ? "text-nav-active" 
                      : "text-nav-inactive hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden ring-2 transition-all",
                    isActive ? "ring-foreground" : "ring-transparent"
                  )}>
                    <img 
                      src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium truncate">Menu</span>
                </button>
              );
            }

            const Icon = item.icon!;

            // Render Create button with emphasis
            if (item.isPrimary) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-3 sm:px-5 py-2 rounded-xl transition-all min-w-0",
                    isActive 
                      ? "text-primary-foreground bg-primary" 
                      : "text-nav-inactive hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", isActive && "stroke-[2.5]")} />
                  <span className="text-xs sm:text-sm font-medium truncate">{item.label}</span>
                </Link>
              );
            }

            // Regular nav items
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-2 rounded-xl transition-colors min-w-0",
                  isActive 
                    ? "text-nav-active" 
                    : "text-nav-inactive hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", isActive && "stroke-[2.5]")} />
                <span className="text-xs sm:text-sm font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
