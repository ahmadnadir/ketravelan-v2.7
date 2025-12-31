import { useState, useRef, ReactNode } from "react";
import { Trash2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableChatItemProps {
  children: ReactNode;
  onDelete: () => void;
  onMarkAsRead: () => void;
  hasUnread: boolean;
}

export function SwipeableChatItem({
  children,
  onDelete,
  onMarkAsRead,
  hasUnread,
}: SwipeableChatItemProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    
    // Limit swipe distance
    const maxSwipe = 100;
    const clampedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    // Only allow right swipe if there are unread messages
    if (diff > 0 && !hasUnread) {
      setOffsetX(0);
      return;
    }
    
    setOffsetX(clampedDiff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (offsetX < -THRESHOLD) {
      // Swiped left - delete
      onDelete();
    } else if (offsetX > THRESHOLD && hasUnread) {
      // Swiped right - mark as read
      onMarkAsRead();
    }
    
    setOffsetX(0);
  };

  const getActionOpacity = () => {
    return Math.min(Math.abs(offsetX) / THRESHOLD, 1);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg">
      {/* Delete action (left swipe) */}
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-destructive transition-opacity",
          offsetX < 0 ? "opacity-100" : "opacity-0"
        )}
        style={{ opacity: offsetX < 0 ? getActionOpacity() : 0, width: "100px" }}
      >
        <Trash2 className="h-5 w-5 text-destructive-foreground" />
      </div>

      {/* Mark as read action (right swipe) */}
      {hasUnread && (
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex items-center justify-start px-4 bg-green-500 transition-opacity"
          )}
          style={{ opacity: offsetX > 0 ? getActionOpacity() : 0, width: "100px" }}
        >
          <CheckCheck className="h-5 w-5 text-white" />
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          "relative bg-card",
          !isDragging && "transition-transform duration-200 ease-out"
        )}
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
