import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  MapPin,
  Calendar,
  Users,
  Image,
  Check,
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  Circle,
  Pencil,
  Wallet,
  Route,
  ClipboardList,
  X,
} from "lucide-react";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useDraftTrip, getDefaultDraft, TripDraft } from "@/hooks/useDraftTrip";
import { DestinationSearch } from "@/components/create-trip/DestinationSearch";
import { RouteBuilder } from "@/components/create-trip/RouteBuilder";
import { BudgetSection } from "@/components/create-trip/BudgetSection";
import { ItinerarySection } from "@/components/create-trip/ItinerarySection";
import { RequirementsSection } from "@/components/create-trip/RequirementsSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { savePublishedTrip, PublishedTrip } from "@/lib/publishedTrips";

const steps = [
  { id: 1, title: "Visibility" },
  { id: 2, title: "Basics" },
  { id: 3, title: "Plan" },
  { id: 4, title: "Review" },
];

const travelStyles = [
  { id: "outdoor", label: "Outdoor & Adventure", icon: "🏔️" },
  { id: "diving", label: "Diving & Water", icon: "🤿" },
  { id: "city", label: "City & Urban", icon: "🏙️" },
  { id: "festival", label: "Festival / Music", icon: "🎉" },
  { id: "crossborder", label: "Cross-Border", icon: "🌍" },
  { id: "umrah", label: "Umrah DIY", icon: "🕋" },
];

export default function CreateTrip() {
  const navigate = useNavigate();
  const { draft, updateDraft, clearDraft, hasDraft, lastSaved, resetDraft } = useDraftTrip();
  const [currentStep, setCurrentStep] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [publishedTripId, setPublishedTripId] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  // Store draft snapshot for share modal (since we clear draft before showing modal)
  const draftSnapshotRef = useRef<TripDraft | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    if (hasDraft && draft.title) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, draft.title]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const canProceedStep2 = () => {
    return (
      draft.title.trim() !== "" &&
      draft.primaryDestination !== "" &&
      draft.travelStyles.length > 0
    );
  };

  const toggleTravelStyle = (styleId: string) => {
    const current = draft.travelStyles;
    if (current.includes(styleId)) {
      updateDraft("travelStyles", current.filter((s) => s !== styleId));
    } else {
      updateDraft("travelStyles", [...current, styleId]);
    }
  };

  const handlePublish = () => {
    // Generate trip ID
    const tripId = `trip-${Date.now()}`;
    setPublishedTripId(tripId);
    
    // Store draft snapshot before clearing (for share modal)
    draftSnapshotRef.current = { ...draft };
    
    // Build and save published trip
    const publishedTrip: PublishedTrip = {
      id: tripId,
      title: draft.title,
      visibility: draft.visibility,
      primaryDestination: draft.primaryDestination,
      additionalStops: draft.additionalStops,
      dateType: draft.dateType,
      startDate: draft.startDate,
      endDate: draft.endDate,
      travelStyles: draft.travelStyles,
      groupSizeType: draft.groupSizeType,
      groupSize: draft.groupSize,
      coverImage: draft.coverImage,
      budgetType: draft.budgetType,
      roughBudgetTotal: draft.roughBudgetTotal,
      roughBudgetCategories: draft.roughBudgetCategories,
      detailedBudget: draft.detailedBudget,
      itineraryType: draft.itineraryType,
      simpleNotes: draft.simpleNotes,
      dayByDayPlan: draft.dayByDayPlan,
      expectations: draft.expectations,
      createdAt: Date.now(),
    };
    
    savePublishedTrip(publishedTrip);
    
    // Clear draft
    clearDraft();
    
    // Show success toast
    toast({
      title: "Trip published! 🎉",
      description: "Your trip is now live and ready for people to join.",
    });
    
    // Show share modal
    setShowShareModal(true);
  };

  const handleStartFresh = () => {
    resetDraft();
    setShowDraftBanner(false);
    setCurrentStep(1);
  };

  const getCompletionStats = () => {
    const essentials = draft.title && draft.primaryDestination && draft.travelStyles.length > 0;
    const optionalCount = [
      draft.budgetType !== "skip",
      draft.itineraryType !== "skip",
      draft.expectations.length > 0,
    ].filter(Boolean).length;
    return { essentials, optionalCount };
  };

  const { essentials, optionalCount } = getCompletionStats();

  // Header content with step indicator
  const headerContent = (
    <div className="bg-background border-b border-border/50 px-4 py-3 safe-top">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
        {/* Draft Banner */}
        {showDraftBanner && (
          <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                Resume your draft: <strong>{draft.title}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleStartFresh}
                className="text-xs h-7"
              >
                Start Fresh
              </Button>
              <button
                onClick={() => setShowDraftBanner(false)}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header with draft indicator */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Create a Trip</h1>
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Draft saved
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-secondary rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-1">
              <button
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground scale-100"
                    : "bg-secondary text-muted-foreground scale-90",
                  step.id < currentStep && "cursor-pointer hover:bg-primary/80",
                  currentStep === step.id && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  step.id
                )}
              </button>
              <span className={cn(
                "text-[10px] sm:text-xs font-medium transition-colors duration-300",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Footer content with CTA buttons
  const footerContent = (
    <div className="bg-background/95 backdrop-blur-sm border-t border-border p-4">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
        <p className="text-xs text-muted-foreground text-center mb-2">
          Step {currentStep} of {steps.length}
        </p>
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={(currentStep === 1 && !draft.visibility) || (currentStep === 2 && !canProceedStep2())}
              className="flex-1 rounded-xl"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={!essentials}
              className="flex-1 rounded-xl"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Publish Trip
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <FocusedFlowLayout
      headerContent={headerContent}
      footerContent={footerContent}
      showBottomNav={true}
      className="px-4 sm:px-6"
    >
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto py-4 sm:py-6">
        {/* Step 1: Visibility */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Who can see this trip?
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                You can change this later
              </p>
            </div>
            
            <div className="grid gap-3">
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  draft.visibility === "public"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                )}
                onClick={() => updateDraft("visibility", "public")}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0",
                    draft.visibility === "public" ? "bg-primary/10" : "bg-secondary"
                  )}>
                    <Globe className={cn(
                      "h-6 w-6",
                      draft.visibility === "public" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">Public Trip</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        Open to everyone
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        Discoverable in feed
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        Anyone can request to join
                      </li>
                    </ul>
                  </div>
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    draft.visibility === "public"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {draft.visibility === "public" && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  draft.visibility === "private"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                )}
                onClick={() => updateDraft("visibility", "private")}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0",
                    draft.visibility === "private" ? "bg-primary/10" : "bg-secondary"
                  )}>
                    <Lock className={cn(
                      "h-6 w-6",
                      draft.visibility === "private" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">Friends / Private</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        Invite-only
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        Hidden from discovery
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        Shareable private link
                      </li>
                    </ul>
                  </div>
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    draft.visibility === "private"
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {draft.visibility === "private" && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Trip Basics */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Trip Basics
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Just the essentials so others understand your trip
              </p>
            </div>

            {/* Trip Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-primary" />
                Trip Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Give your trip a name..."
                value={draft.title}
                onChange={(e) => updateDraft("title", e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            {/* Primary Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                Primary Destination <span className="text-destructive">*</span>
              </label>
              <DestinationSearch
                value={draft.primaryDestination}
                onChange={(val) => updateDraft("primaryDestination", val)}
                helperText="This is the main place your trip is centered around."
              />
            </div>

            {/* Additional Stops */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Route className="h-4 w-4 text-muted-foreground" />
                Route / Additional Stops
              </label>
              <RouteBuilder
                stops={draft.additionalStops}
                onChange={(stops) => updateDraft("additionalStops", stops)}
                primaryDestination={draft.primaryDestination}
              />
            </div>

            {/* Dates */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Dates
              </label>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                <span className="text-sm text-foreground">
                  {draft.dateType === "flexible" ? "Flexible dates" : "Set exact dates"}
                </span>
                <Switch
                  checked={draft.dateType === "exact"}
                  onCheckedChange={(checked) =>
                    updateDraft("dateType", checked ? "exact" : "flexible")
                  }
                />
              </div>
              {draft.dateType === "exact" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Start</label>
                    <Input
                      type="date"
                      value={draft.startDate}
                      onChange={(e) => updateDraft("startDate", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">End</label>
                    <Input
                      type="date"
                      value={draft.endDate}
                      onChange={(e) => updateDraft("endDate", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Travel Style */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Travel Style <span className="text-destructive">*</span>
              </label>
              <p className="text-xs text-muted-foreground -mt-1">
                Helps others understand the vibe. Select at least one.
              </p>
              <div className="flex flex-wrap gap-2">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleTravelStyle(style.id)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-xl border transition-all flex items-center gap-2",
                      draft.travelStyles.includes(style.id)
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-secondary/50 border-border/50 text-foreground hover:border-primary/30"
                    )}
                  >
                    <span>{style.icon}</span>
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Group Size */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                Group Size
              </label>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                <span className="text-sm text-foreground">
                  {draft.groupSizeType === "later" ? "Decide later" : `${draft.groupSize} people max`}
                </span>
                <Switch
                  checked={draft.groupSizeType === "set"}
                  onCheckedChange={(checked) =>
                    updateDraft("groupSizeType", checked ? "set" : "later")
                  }
                />
              </div>
              {draft.groupSizeType === "set" && (
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateDraft("groupSize", Math.max(2, draft.groupSize - 1))}
                    className="rounded-xl h-10 w-10 p-0"
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold text-foreground min-w-[3ch] text-center">
                    {draft.groupSize}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateDraft("groupSize", Math.min(50, draft.groupSize + 1))}
                    className="rounded-xl h-10 w-10 p-0"
                  >
                    +
                  </Button>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Image className="h-4 w-4 text-muted-foreground" />
                Cover Image
              </label>
              <Card className="p-6 border-dashed border-2 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 rounded-xl bg-secondary">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click to upload (optional)
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Plan (Optional) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Add Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                All optional — you can refine later in the group chat
              </p>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Budget</h3>
              </div>
              <BudgetSection
                budgetType={draft.budgetType}
                onBudgetTypeChange={(type) => updateDraft("budgetType", type)}
                roughBudgetTotal={draft.roughBudgetTotal}
                onRoughBudgetTotalChange={(val) => updateDraft("roughBudgetTotal", val)}
                roughBudgetCategories={draft.roughBudgetCategories}
                onRoughBudgetCategoriesChange={(cats) => updateDraft("roughBudgetCategories", cats)}
                detailedBudget={draft.detailedBudget}
                onDetailedBudgetChange={(budget) => updateDraft("detailedBudget", budget)}
              />
            </div>

            {/* Itinerary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Itinerary</h3>
              </div>
              <ItinerarySection
                itineraryType={draft.itineraryType}
                onItineraryTypeChange={(type) => updateDraft("itineraryType", type)}
                simpleNotes={draft.simpleNotes}
                onSimpleNotesChange={(notes) => updateDraft("simpleNotes", notes)}
                dayByDayPlan={draft.dayByDayPlan}
                onDayByDayPlanChange={(plan) => updateDraft("dayByDayPlan", plan)}
                startDate={draft.startDate}
                endDate={draft.endDate}
              />
            </div>

            {/* Requirements / What to Expect */}
            <div className="pt-2">
              <RequirementsSection
                expectations={draft.expectations}
                onChange={(exps) => updateDraft("expectations", exps)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Review Your Trip
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Make sure everything looks good before publishing
              </p>
            </div>

            {/* Trip Preview Card */}
            <Card className="overflow-hidden border-border/50">
              {/* Gradient header */}
              <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-accent relative">
                <div className="absolute top-3 left-3">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    draft.visibility === "public"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {draft.visibility === "public" ? "🌐 Public" : "🔒 Private"}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="absolute top-3 right-3 p-1.5 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Title & Destination */}
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {draft.title || "Untitled Trip"}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {draft.primaryDestination || "No destination set"}
                    {draft.additionalStops.length > 0 && (
                      <span className="text-xs">
                        → +{draft.additionalStops.length} stop{draft.additionalStops.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Route summary */}
                {draft.additionalStops.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {draft.primaryDestination}
                    </span>
                    {draft.additionalStops.map((stop, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="text-muted-foreground">→</span>
                        <span className="px-2 py-1 bg-secondary text-foreground rounded-full">
                          {stop}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">Dates</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {draft.dateType === "flexible"
                        ? "Flexible"
                        : draft.startDate && draft.endDate
                        ? `${new Date(draft.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(draft.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : "Not set"}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">Group Size</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {draft.groupSizeType === "later"
                        ? "Decide later"
                        : `Up to ${draft.groupSize}`}
                    </p>
                  </div>
                </div>

                {/* Travel Styles */}
                {draft.travelStyles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {draft.travelStyles.map((styleId) => {
                      const style = travelStyles.find((s) => s.id === styleId);
                      return style ? (
                        <span
                          key={styleId}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {style.icon} {style.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Budget summary */}
                {draft.budgetType !== "skip" && (
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {draft.budgetType === "rough"
                        ? draft.roughBudgetTotal
                          ? `~RM ${draft.roughBudgetTotal.toLocaleString()}`
                          : "Rough estimate"
                        : `RM ${Object.values(draft.detailedBudget).reduce((a, b) => a + b, 0).toLocaleString()}`}
                    </p>
                  </div>
                )}

                {/* Expectations */}
                {draft.expectations.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">What to Expect</p>
                    <div className="flex flex-wrap gap-1.5">
                      {draft.expectations.map((exp, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-secondary text-foreground text-xs rounded-full"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Readiness Indicators */}
            <Card className="p-4 border-border/50 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Readiness</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {essentials ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-foreground">Essentials complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    ⏳ {optionalCount}/3 optional details added
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                You can always add more details later in the Trip Hub
              </p>
            </Card>

            {/* Edit shortcuts */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="gap-1.5 rounded-xl"
              >
                <Pencil className="h-3.5 w-3.5" />
                Visibility
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(2)}
                className="gap-1.5 rounded-xl"
              >
                <Pencil className="h-3.5 w-3.5" />
                Basics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(3)}
                className="gap-1.5 rounded-xl"
              >
                <Pencil className="h-3.5 w-3.5" />
                Plan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-2xl">🎉</span>
              <br />
              Your trip is live!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Share it with friends or let others discover it
            </p>
            
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
              <input
                type="text"
                readOnly
                value={`https://ketravelan.app/trip/${publishedTripId}`}
                className="flex-1 bg-transparent text-sm text-foreground outline-none"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(`https://ketravelan.app/trip/${publishedTripId}`);
                  toast({ title: "Link copied!" });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setShowShareModal(false);
                  navigate(`/trip/${publishedTripId}`);
                }}
              >
                View Trip
              </Button>
              <Button
                className="flex-1 rounded-xl gap-2"
                onClick={() => {
                  // Share API or fallback - use snapshot since draft is cleared
                  if (navigator.share && draftSnapshotRef.current) {
                    navigator.share({
                      title: draftSnapshotRef.current.title,
                      url: `https://ketravelan.app/trip/${publishedTripId}`,
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FocusedFlowLayout>
  );
}
