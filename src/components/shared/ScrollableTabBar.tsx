import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableTabBarProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ScrollableTabBar({
  options,
  value,
  onChange,
  className,
}: ScrollableTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;
      setShowScrollHint(!isAtEnd);
    };

    // Initial check
    handleScroll();

    // Also check on resize
    const handleResize = () => handleScroll();

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto p-1 bg-secondary rounded-xl scrollbar-hide"
        style={{ 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain"
        }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-[44px] px-4 text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center justify-center",
              value === option.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Right edge fade gradient */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-10 pointer-events-none transition-opacity duration-300 rounded-r-xl",
          "bg-gradient-to-l from-secondary to-transparent",
          showScrollHint ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Chevron hint */}
      <div
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300",
          showScrollHint ? "opacity-50" : "opacity-0"
        )}
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
