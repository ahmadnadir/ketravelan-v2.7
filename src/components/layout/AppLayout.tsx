import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { MenuDrawer } from "./MenuDrawer";
import { NotificationsSheet } from "@/components/notifications/NotificationsSheet";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export function AppLayout({ children, hideHeader = false, hideBottomNav = false }: AppLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Only show bottom nav for authenticated users
  const showBottomNav = isAuthenticated && !hideBottomNav;

  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && (
        <Header 
          onNotificationsClick={() => setNotificationsOpen(true)} 
          onMenuClick={() => setMenuOpen(true)}
        />
      )}
      
      <main className={`container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 ${showBottomNav ? 'pb-28' : 'pb-4'}`}>
        {children}
      </main>

      {showBottomNav && (
        <BottomNav />
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
