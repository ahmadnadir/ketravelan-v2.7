import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatScreen } from "./mockup-screens/ChatScreen";
import { ExpensesScreen } from "./mockup-screens/ExpensesScreen";
import { MembersScreen } from "./mockup-screens/MembersScreen";
import { SettlementScreen } from "./mockup-screens/SettlementScreen";

interface MockupState {
  id: number;
  component: React.FC;
}

const mockupStates: MockupState[] = [
  { id: 1, component: ChatScreen },
  { id: 2, component: ExpensesScreen },
  { id: 3, component: MembersScreen },
  { id: 4, component: SettlementScreen },
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
      className="relative mx-auto w-[280px] sm:w-[300px] md:w-[320px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Floating Screen with shadow - no phone frame */}
      <div className="relative bg-background rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-border/30 h-[500px] sm:h-[540px] md:h-[580px]">
        {/* Screen content with fade transitions */}
        {mockupStates.map((state, index) => {
          const StateComponent = state.component;
          return (
            <div
              key={state.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <StateComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
}
