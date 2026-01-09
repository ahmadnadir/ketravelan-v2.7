import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { MenuDrawer } from "./MenuDrawer";
import { NotificationsSheet } from "@/components/notifications/NotificationsSheet";
import { useAuth } from "@/contexts/AuthContext";
import { usePreventRubberBand } from "@/hooks/usePreventRubberBand";

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

/**
 * AppLayout - Global layout shell with scroll containment.
 * 
 * Uses fixed viewport architecture to prevent scroll bleed:
 * - Header is anchored at top (flex-none)
 * - Content area is the ONLY scrollable region (flex-1 overflow-y-auto)
 * - Bottom nav is anchored at bottom (flex-none, inline mode)
 * 
 * This prevents the "rubber band" effect from dragging the navbar on mobile.
 */
export function AppLayout({ children, hideHeader = false, hideBottomNav = false }: AppLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Prevent iOS rubber-band effect at document level
  usePreventRubberBand();

  // Only show bottom nav for authenticated users
  const showBottomNav = isAuthenticated && !hideBottomNav;

  return (
    <div className="fixed inset-0 flex flex-col h-dvh overflow-hidden bg-background pl-safe pr-safe">
      {/* Header zone - anchored at top */}
      {!hideHeader && (
        <div className="flex-none">
          <Header 
            onNotificationsClick={() => setNotificationsOpen(true)} 
            onMenuClick={() => setMenuOpen(true)}
          />
        </div>
      )}
      
      {/* Scrollable content - ONLY this element scrolls */}
      <main 
        data-scroll-container="app"
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scroll-container"
      >
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {children}
        </div>
      </main>

      {/* Bottom nav - anchored at bottom */}
      {showBottomNav && (
        <div className="flex-none">
          <BottomNav inline />
        </div>
      )}

      <NotificationsSheet 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />

      <MenuDrawer
        open={menuOpen}
        onOpenChange={setMenuOpen}
      />
    </div>
  );
}
