import { Bell, MessageCircle, UserPlus, DollarSign, Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "join_request" | "message" | "expense" | "trip_update";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          {mockNotifications.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer",
                  notification.read
                    ? "bg-transparent hover:bg-muted/50"
                    : "bg-accent/50 hover:bg-accent"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full shrink-0",
                  notification.read ? "bg-muted" : "bg-primary/10"
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    notification.read ? "text-muted-foreground" : "text-primary"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm",
                      !notification.read && "font-medium"
                    )}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button variant="outline" className="w-full">
            Mark all as read
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}