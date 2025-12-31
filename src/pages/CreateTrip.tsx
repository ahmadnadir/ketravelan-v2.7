import { useState, useRef } from "react";
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
  FileText,
  X,
} from "lucide-react";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDraftTrip, TripDraft } from "@/hooks/useDraftTrip";
import { DestinationSearch } from "@/components/create-trip/DestinationSearch";
import { RouteBuilder } from "@/components/create-trip/RouteBuilder";
import { BudgetSection } from "@/components/create-trip/BudgetSection";
import { ItinerarySection } from "@/components/create-trip/ItinerarySection";
import { RequirementsSection } from "@/components/create-trip/RequirementsSection";
import { OptionCard } from "@/components/create-trip/OptionCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { savePublishedTrip, PublishedTrip } from "@/lib/publishedTrips";
import { tripCategories } from "@/data/categories";

const steps = [
  { id: 1, title: "Visibility" },
  { id: 2, title: "Basics" },
  { id: 3, title: "Plan" },
  { id: 4, title: "Review" },
];

export default function CreateTrip() {
  const navigate = useNavigate();
  const { draft, updateDraft, clearDraft, lastSaved } = useDraftTrip();
  const [currentStep, setCurrentStep] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [publishedTripId, setPublishedTripId] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  // Store draft snapshot for share modal (since we clear draft before showing modal)
  const draftSnapshotRef = useRef<TripDraft | null>(null);
  // File input ref for gallery images
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Handle gallery image upload
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Convert to base64 for localStorage storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && draft.galleryImages.length < 5) {
        updateDraft("galleryImages", [...draft.galleryImages, base64]);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

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
      description: draft.description,
      visibility: draft.visibility,
      primaryDestination: draft.primaryDestination,
      additionalStops: draft.additionalStops,
      dateType: draft.dateType,
      startDate: draft.startDate,
      endDate: draft.endDate,
      travelStyles: draft.travelStyles,
      groupSizeType: draft.groupSizeType,
      groupSize: draft.groupSize,
      galleryImages: draft.galleryImages,
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
    <div className="bg-background border-b border-border/50 px-4 pt-8 pb-4 safe-top">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
        {/* Top navigation row */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Create a Trip
          </h1>
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Draft saved
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-secondary rounded-full overflow-hidden mb-5">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-1.5">
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

  // Footer content with CTA buttons - positioned above bottom nav with proper clearance
  const footerContent = (
    <div className="bg-background/98 backdrop-blur-md border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="px-4 pt-3 pb-5">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* Back button - always visible */}
            <Button
              variant="outline"
              onClick={currentStep === 1 ? () => setShowExitModal(true) : prevStep}
              className="rounded-lg h-11 text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {/* Continue/Publish button */}
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={(currentStep === 1 && !draft.visibility) || (currentStep === 2 && !canProceedStep2())}
                className="rounded-lg h-11 text-sm font-medium"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!essentials}
                className="rounded-lg h-11 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
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
              <OptionCard
                icon={<Globe className="h-6 w-6" />}
                title="Public Trip"
                description={
                  <ul className="space-y-1 text-sm text-muted-foreground">
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
                }
                selected={draft.visibility === "public"}
                onClick={() => updateDraft("visibility", "public")}
                iconSize="md"
              />

              <OptionCard
                icon={<Lock className="h-6 w-6" />}
                title="Friends / Private"
                description={
                  <ul className="space-y-1 text-sm text-muted-foreground">
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
                }
                selected={draft.visibility === "private"}
                onClick={() => updateDraft("visibility", "private")}
                iconSize="md"
              />
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

            {/* About This Trip */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                About This Trip
              </label>
              <Textarea
                placeholder="Describe what makes this trip special, what travelers can expect..."
                value={draft.description}
                onChange={(e) => updateDraft("description", e.target.value)}
                className="rounded-xl text-sm min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                This will appear on your trip page to help others understand your trip.
              </p>
            </div>

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
                {tripCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleTravelStyle(category.id)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-full border transition-all flex items-center gap-2 active:scale-95",
                      draft.travelStyles.includes(category.id)
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-white border-border text-muted-foreground hover:bg-foreground hover:text-background"
                    )}
                  >
                    <span>{category.icon}</span>
                    {category.label}
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
                <div className="flex items-center justify-center gap-6 py-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateDraft("groupSize", Math.max(2, draft.groupSize - 1))}
                    className="rounded-full h-12 w-12 p-0 text-lg font-bold"
                  >
                    −
                  </Button>
                  <span className="text-3xl font-bold text-foreground min-w-[3ch] text-center">
                    {draft.groupSize}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateDraft("groupSize", Math.min(50, draft.groupSize + 1))}
                    className="rounded-full h-12 w-12 p-0 text-lg font-bold"
                  >
                    +
                  </Button>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Image className="h-4 w-4 text-muted-foreground" />
                Trip Gallery (up to 5 photos)
              </label>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={galleryInputRef}
                accept="image/*"
                onChange={handleGalleryImageUpload}
                className="hidden"
              />
              
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    {draft.galleryImages[index] ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-border">
                        <img 
                          src={draft.galleryImages[index]} 
                          alt={`Gallery ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = draft.galleryImages.filter((_, i) => i !== index);
                            updateDraft("galleryImages", updated);
                          }}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (draft.galleryImages.length < 5) {
                            galleryInputRef.current?.click();
                          }
                        }}
                        disabled={draft.galleryImages.length >= 5}
                        className="w-full"
                      >
                        <Card className="aspect-square border-dashed border-2 border-border/50 hover:border-primary/30 transition-colors cursor-pointer flex items-center justify-center">
                          <div className="flex flex-col items-center gap-1 text-center p-2">
                            <Image className="h-5 w-5 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground">
                              {index === 0 ? "Cover" : "Add"}
                            </p>
                          </div>
                        </Card>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                First image will be used as the cover photo
              </p>
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
                      const category = tripCategories.find((c) => c.id === styleId);
                      return category ? (
                        <span
                          key={styleId}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {category.icon} {category.label}
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
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-3 border-b border-border/50">
            <DialogTitle className="text-center">
              <span className="text-2xl">🎉</span>
              <br />
              Your trip is live!
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
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

      {/* Exit Confirmation Drawer */}
      <Drawer open={showExitModal} onOpenChange={setShowExitModal}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>Leave trip creation?</DrawerTitle>
            <DrawerDescription>
              Your progress can be saved as a draft, or you can discard this trip.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="gap-3 pb-8">
            <Button
              onClick={() => {
                setShowExitModal(false);
                navigate('/my-trips?tab=draft');
              }}
              className="rounded-xl h-12"
            >
              Save as Draft
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearDraft();
                setShowExitModal(false);
                navigate('/explore');
              }}
              className="rounded-xl h-12"
            >
              Discard Trip
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowExitModal(false)}
              className="rounded-xl h-12"
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </FocusedFlowLayout>
  );
}
