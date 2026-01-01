import { ReactNode, useRef, useState } from "react";
import { Trash2, CheckCheck } from "lucide-react";

interface SwipeableNotificationItemProps {
  children: ReactNode;
  onDismiss: () => void;
  onMarkAsRead: () => void;
  isUnread: boolean;
}

export function SwipeableNotificationItem({
  children,
  onDismiss,
  onMarkAsRead,
  isUnread,
}: SwipeableNotificationItemProps) {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    // Allow right swipe only if unread
    if (diff > 0 && !isUnread) {
      setOffset(0);
      return;
    }
    
    // Limit the swipe distance
    const maxOffset = 100;
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, diff));
    setOffset(clampedOffset);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    
    if (offset < -THRESHOLD) {
      // Swiped left - dismiss
      onDismiss();
    } else if (offset > THRESHOLD && isUnread) {
      // Swiped right - mark as read
      onMarkAsRead();
    }
    
    setOffset(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action - Mark as read (shown when swiping right) */}
      {isUnread && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 bg-green-500 text-white"
          style={{ width: Math.max(0, offset) }}
        >
          {offset > 40 && <CheckCheck className="h-5 w-5" />}
        </div>
      )}

      {/* Right action - Dismiss (shown when swiping left) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-destructive text-destructive-foreground"
        style={{ width: Math.max(0, -offset) }}
      >
        {offset < -40 && <Trash2 className="h-5 w-5" />}
      </div>

      {/* Main content */}
      <div
        className="relative bg-white dark:bg-card rounded-xl transition-transform duration-75"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
