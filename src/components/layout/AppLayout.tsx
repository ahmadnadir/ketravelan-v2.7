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
      
      <main className={`container max-w-lg mx-auto px-4 ${!hideBottomNav ? 'pb-24' : 'pb-4'}`}>
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