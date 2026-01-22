import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { StorySetupStep } from "@/components/story-builder/StorySetupStep";
import { StoryBuilder } from "@/components/story-builder/StoryBuilder";
import { PublishStep } from "@/components/story-builder/PublishStep";
import { DraftBanner } from "@/components/story-builder/DraftBanner";
import { useStoryDraft, StoryDraft } from "@/hooks/useStoryDraft";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Step = "setup" | "builder" | "publish";

const stepLabels: Record<Step, string> = {
  setup: "Story Setup",
  builder: "Story Builder",
  publish: "Review & Publish",
};

export default function CreateStory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  
  const {
    draft,
    hasDraft,
    saveDraft,
    clearDraft,
    updateBlock,
    addBlock,
    removeBlock,
    reorderBlocks,
  } = useStoryDraft();

  // Check for linked trip from URL
  useEffect(() => {
    const tripId = searchParams.get("tripId");
    if (tripId) {
      saveDraft({ linkedTripId: tripId });
    }
  }, [searchParams, saveDraft]);

  // Show draft banner if there's an existing draft
  useEffect(() => {
    if (hasDraft && draft.title) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, draft.title]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/create-story");
    }
  }, [isAuthenticated, navigate]);

  const handleBack = () => {
    if (currentStep === "setup") {
      // Check if there's unsaved content
      if (draft.title || draft.blocks.length > 0) {
        setShowExitDialog(true);
      } else {
        navigate(-1);
      }
    } else if (currentStep === "builder") {
      setCurrentStep("setup");
    } else if (currentStep === "publish") {
      setCurrentStep("builder");
    }
  };

  const handleClose = () => {
    if (draft.title || draft.blocks.length > 0) {
      setShowExitDialog(true);
    } else {
      navigate(-1);
    }
  };

  const handleSetupComplete = (data: Partial<StoryDraft>) => {
    saveDraft(data);
    setCurrentStep("builder");
  };

  const handleBuilderComplete = () => {
    setCurrentStep("publish");
  };

  const handlePublish = () => {
    // In a real app, this would send to the backend
    clearDraft();
    navigate("/community");
  };

  const handleSaveAsDraft = () => {
    // Draft is already saved via auto-save
    navigate("/community");
  };

  const handleResumeDraft = () => {
    setShowDraftBanner(false);
    // Determine which step to resume from
    if (draft.blocks.length > 0) {
      setCurrentStep("builder");
    } else if (draft.title && draft.country) {
      setCurrentStep("builder");
    }
  };

  const handleStartFresh = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    navigate(-1);
  };

  const headerContent = (
    <header className="glass border-b border-border/50">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-foreground">{stepLabels[currentStep]}</h1>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex gap-1.5 pb-3">
          {(["setup", "builder", "publish"] as Step[]).map((step, index) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= ["setup", "builder", "publish"].indexOf(currentStep)
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );

  return (
    <>
      <SEOHead
        title="Share Your Story | Ketravelan"
        description="Share your travel experiences with the Ketravelan community. Write about your adventures, lessons learned, and tips for fellow travelers."
      />
      
      <FocusedFlowLayout headerContent={headerContent} showBottomNav={true}>
        {/* Draft Banner */}
        {showDraftBanner && (
          <DraftBanner
            lastSaved={draft.lastSaved}
            onResume={handleResumeDraft}
            onStartFresh={handleStartFresh}
          />
        )}
        
        {/* Step Content */}
        <div className="container max-w-3xl mx-auto">
          {currentStep === "setup" && (
            <StorySetupStep
              draft={draft}
              onComplete={handleSetupComplete}
            />
          )}
          
          {currentStep === "builder" && (
            <StoryBuilder
              draft={draft}
              saveDraft={saveDraft}
              addBlock={addBlock}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
              reorderBlocks={reorderBlocks}
              onComplete={handleBuilderComplete}
            />
          )}
          
          {currentStep === "publish" && (
            <PublishStep
              draft={draft}
              saveDraft={saveDraft}
              onPublish={handlePublish}
              onSaveAsDraft={handleSaveAsDraft}
              onBack={() => setCurrentStep("builder")}
            />
          )}
        </div>
      </FocusedFlowLayout>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save as draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Your story progress will be saved and you can continue later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExitConfirm}>
              Discard
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowExitDialog(false);
              navigate(-1);
            }}>
              Save Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
