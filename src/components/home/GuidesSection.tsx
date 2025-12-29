import { useState } from "react";
import { cn } from "@/lib/utils";

type TripMode = "diy" | "guided";

const stepsContent = {
  diy: [
    "Create or join a trip",
    "Invite friends or meet travelers",
    "Plan in group chat",
    "Add expenses & split bills",
    "Settle via QR & travel",
  ],
  guided: [
    "Browse verified guided trips",
    "Pay deposit to secure spot",
    "Join trip group chat",
    "Complete payment milestones",
    "Travel with your group",
  ],
};

export function GuidesSection() {
  const [tripMode, setTripMode] = useState<TripMode>("diy");
  const steps = stepsContent[tripMode];

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">
        Ketravelan Guides
      </h2>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setTripMode("diy")}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            tripMode === "diy"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          DIY Process
        </button>
        <button
          onClick={() => setTripMode("guided")}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            tripMode === "guided"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Guided Process
        </button>
      </div>

      {/* Horizontal Step Cards */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x snap-mandatory">
        {steps.map((step, index) => (
          <div
            key={index}
            className="shrink-0 snap-start w-[140px] sm:w-[160px] flex flex-col items-center text-center gap-3"
          >
            {/* Numbered Circle */}
            <div className="relative">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl font-bold">
                {index + 1}
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 left-full w-[calc(140px-3rem)] sm:w-[calc(160px-3.5rem)] h-0.5 bg-border -translate-y-1/2 ml-1.5" />
              )}
            </div>
            {/* Step Text */}
            <p className="text-xs sm:text-sm text-foreground font-medium leading-tight">
              {step}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
