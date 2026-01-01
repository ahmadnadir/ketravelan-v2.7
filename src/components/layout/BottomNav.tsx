import { Compass, PlusCircle, MessageCircle, Receipt, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isPrimary?: boolean;
  isProfile?: boolean;
}

const navItems: NavItem[] = [
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: PlusCircle, label: "Create", path: "/create", isPrimary: true },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { label: "Profile", path: "/profile", isProfile: true },
];

interface BottomNavProps {
  inline?: boolean;
}

export function BottomNav({ inline = false }: BottomNavProps) {
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

            const Icon = item.icon;

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

            // Profile item with icon
            if (item.isProfile) {
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
                  <User className={cn("h-6 w-6 sm:h-7 sm:w-7", isActive && "stroke-[2.5]")} />
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
                {Icon && <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", isActive && "stroke-[2.5]")} />}
                <span className="text-xs sm:text-sm font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
