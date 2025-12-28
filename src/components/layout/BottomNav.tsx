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

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors",
                  isActive 
                    ? "text-nav-active" 
                    : "text-nav-inactive hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}