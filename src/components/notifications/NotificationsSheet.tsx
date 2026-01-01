import { useState } from "react";
import { Bell, MessageCircle, UserPlus, DollarSign, Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SwipeableNotificationItem } from "./SwipeableNotificationItem";

interface Notification {
  id: string;
  type: "join_request" | "message" | "expense" | "trip_update";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "join_request",
    title: "New Join Request",
    description: "Sarah wants to join your Langkawi trip",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "Ahmad: Looking forward to the trip!",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "expense",
    title: "Expense Added",
    description: "Lisa added RM 450 for accommodation",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "trip_update",
    title: "Trip Updated",
    description: "Itinerary updated for Cameron Highlands",
    time: "Yesterday",
    read: true,
  },
];

const iconMap = {
  join_request: UserPlus,
  message: MessageCircle,
  expense: DollarSign,
  trip_update: Calendar,
};

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md px-4 sm:px-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No notifications</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              return (
                <SwipeableNotificationItem
                  key={notification.id}
                  onDismiss={() => handleDismiss(notification.id)}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  isUnread={!notification.read}
                >
                  <div
                    className={cn(
                      "flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-colors cursor-pointer",
                      "bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 sm:p-2 rounded-full shrink-0",
                      notification.read ? "bg-muted" : "bg-destructive/10"
                    )}>
                      <Icon className={cn(
                        "h-3.5 w-3.5 sm:h-4 sm:w-4",
                        notification.read ? "text-muted-foreground" : "text-destructive"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-xs sm:text-sm",
                          !notification.read && "font-medium"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-destructive shrink-0 mt-1 sm:mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                        {notification.description}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </SwipeableNotificationItem>
              );
            })
          )}
        </div>

        {notifications.length > 0 && (
          <div className="mt-4 sm:mt-6 pb-4 sm:pb-0">
            <Button
              variant="outline"
              className="w-full text-sm sm:text-base"
              onClick={handleMarkAllAsRead}
              disabled={!hasUnread}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
