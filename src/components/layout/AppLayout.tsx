import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { NotificationsSheet } from "@/components/notifications/NotificationsSheet";

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export function AppLayout({ children, hideHeader = false, hideBottomNav = false }: AppLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && (
        <Header onNotificationsClick={() => setNotificationsOpen(true)} />
      )}
      
      <main className={`container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 ${!hideBottomNav ? 'pb-28' : 'pb-4'}`}>
        {children}
      </main>

      {!hideBottomNav && <BottomNav />}

      <NotificationsSheet 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
    </div>
  );
}
