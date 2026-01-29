import { Compass, PlusCircle, MessageCircle, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: PlusCircle, label: "Create", path: "/create" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface BottomNavProps {
  inline?: boolean;
}

export function BottomNav({ inline = false }: BottomNavProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide bottom nav for logged-out users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={cn(
      "z-50 pb-safe transition-all duration-300",
      inline ? "" : "fixed bottom-0 left-0 right-0"
    )}>
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass border-t border-x border-border/50 rounded-t-xl flex items-center justify-between h-16 sm:h-18 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 sm:gap-1 py-2 rounded-xl transition-colors flex-1",
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
