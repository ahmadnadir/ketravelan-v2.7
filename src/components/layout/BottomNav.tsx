import { Home, Compass, PlusCircle, MessageCircle, Map } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: PlusCircle, label: "Create", path: "/create" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Map, label: "My Trips", path: "/my-trips" },
];

interface BottomNavProps {
  inline?: boolean;
}

export function BottomNav({ inline = false }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className={cn(
      "z-50 glass border-t border-border/50 safe-bottom",
      inline ? "" : "fixed bottom-0 left-0 right-0"
    )}>
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-16 sm:h-18">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

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
