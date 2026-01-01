const diySteps = [
  "Create or join a trip",
  "Invite friends or meet travelers",
  "Plan in group chat",
  "Add expenses & split bills",
  "Settle via QR & travel",
];

export function GuidesSection() {
  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">
        Ketravelan Guides
      </h2>

      {/* Horizontal Step Cards */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x snap-mandatory">
        {diySteps.map((step, index) => (
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
              {index < diySteps.length - 1 && (
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
