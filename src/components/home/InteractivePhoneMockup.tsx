import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatScreen } from "./mockup-screens/ChatScreen";
import { ExpensesScreen } from "./mockup-screens/ExpensesScreen";
import { MembersScreen } from "./mockup-screens/MembersScreen";
import { SettlementScreen } from "./mockup-screens/SettlementScreen";

interface MockupState {
  id: number;
  component: React.FC;
  caption: string;
}

const mockupStates: MockupState[] = [
  {
    id: 1,
    component: ChatScreen,
    caption: "Meet people before the trip even starts.",
  },
  {
    id: 2,
    component: ExpensesScreen,
    caption: "Split costs fairly. No chasing. No drama.",
  },
  {
    id: 3,
    component: MembersScreen,
    caption: "See who you're traveling with. Decide with confidence.",
  },
  {
    id: 4,
    component: SettlementScreen,
    caption: "Plan, pay, and move on — in one place.",
  },
];

export function InteractivePhoneMockup() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mockupStates.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Phone Frame */}
      <div className="relative mx-auto w-[260px] sm:w-[280px] md:w-[300px]">
        {/* Phone outer frame */}
        <div className="relative bg-gray-900 rounded-[36px] sm:rounded-[40px] p-1.5 sm:p-2 shadow-2xl">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 bg-gray-900 rounded-full z-10" />

          {/* Screen */}
          <div className="relative bg-background rounded-[28px] sm:rounded-[32px] overflow-hidden h-[460px] sm:h-[500px] md:h-[540px]">
            {/* Screen content with transitions */}
            <div className="relative h-full">
              {mockupStates.map((state, index) => {
                const StateComponent = state.component;
                return (
                  <div
                    key={state.id}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500 ease-in-out",
                      index === activeIndex
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    )}
                  >
                    <StateComponent />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5">
        {mockupStates.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-foreground w-4 sm:w-5"
                : "bg-muted-foreground/30 w-1.5 sm:w-2 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Dynamic Caption */}
      <p className="text-sm sm:text-base text-muted-foreground text-center mt-3 sm:mt-4 max-w-[280px] sm:max-w-xs transition-opacity duration-300">
        {mockupStates[activeIndex].caption}
      </p>
    </div>
  );
}
