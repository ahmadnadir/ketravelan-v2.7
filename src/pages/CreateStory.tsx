import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StorySetupStep } from "@/components/story-builder/StorySetupStep";
import { StoryBuilder } from "@/components/story-builder/StoryBuilder";
import { PublishStep } from "@/components/story-builder/PublishStep";
import { DraftBanner } from "@/components/story-builder/DraftBanner";
import { useStoryDraft, StoryDraft } from "@/hooks/useStoryDraft";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/seo/SEOHead";
import { toast } from "sonner";
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

function CreateStoryContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { publishStory, updateStory, getStoryById } = useCommunity();
  
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  
  const {
    draft,
    hasDraft,
    saveDraft,
    clearDraft,
    addInlineMedia,
    updateInlineMedia,
    removeInlineMedia,
    toggleSocialLink,
  } = useStoryDraft();

  // Check for edit mode from URL
  useEffect(() => {
    const storyId = searchParams.get("edit");
    if (storyId) {
      const existingStory = getStoryById(storyId);
      if (existingStory && existingStory.author.id === "current-user") {
        setEditingStoryId(storyId);
        // Convert story inline media back to draft format
        const draftInlineMedia = (existingStory.inlineMedia || []).map((media) => ({
          id: media.id,
          type: media.type as "image" | "gallery",
          images: media.images,
          insertPosition: media.insertPosition,
        }));
        // Load story data into draft
        saveDraft({
          title: existingStory.title,
          storyType: existingStory.storyType,
          country: existingStory.location.country,
          city: existingStory.location.city || "",
          coverImage: existingStory.coverImage,
          content: existingStory.content || "",
          contentAfterMedia: existingStory.contentAfterMedia || "",
          blocks: existingStory.blocks || [],
          inlineMedia: draftInlineMedia,
          selectedSocialLinks: existingStory.selectedSocialLinks || [],
          visibility: existingStory.visibility,
          socialLinks: existingStory.socialLinks || [],
          linkedTripId: existingStory.linkedTripId || null,
        });
        // Skip setup step and go directly to builder
        setCurrentStep("builder");
        setShowDraftBanner(false);
      }
    }
  }, [searchParams, getStoryById, saveDraft]);

  // Check for linked trip from URL
  useEffect(() => {
    const tripId = searchParams.get("tripId");
    if (tripId && !editingStoryId) {
      saveDraft({ linkedTripId: tripId });
    }
  }, [searchParams, saveDraft, editingStoryId]);

  // Show draft banner if there's an existing draft (only when not editing)
  useEffect(() => {
    if (hasDraft && draft.title && !editingStoryId) {
      setShowDraftBanner(true);
    }
  }, [hasDraft, draft.title, editingStoryId]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/create-story");
    }
  }, [isAuthenticated, navigate]);

  const handleBack = () => {
    if (currentStep === "setup") {
      // Check if there's unsaved content
      if (draft.title || draft.content.trim().length > 0) {
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
    if (draft.title || draft.content.trim().length > 0) {
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
    if (editingStoryId) {
      // Update existing story
      const updatedStory = updateStory(editingStoryId, draft);
      if (updatedStory) {
        clearDraft();
        toast.success("Story updated successfully!");
        navigate(`/community/stories/${updatedStory.slug}`);
      }
    } else {
      // Create new story
      const newStory = publishStory(draft);
      clearDraft();
      toast.success("Story published successfully!");
      navigate(`/community/stories/${newStory.slug}`);
    }
  };

  const handleSaveAsDraft = () => {
    // Draft is already saved via auto-save
    toast.success("Story saved as draft");
    navigate("/community");
  };

  const handleResumeDraft = () => {
    setShowDraftBanner(false);
    // Determine which step to resume from
    if (draft.content.trim().length > 0) {
      setCurrentStep("builder");
    } else if (draft.title) {
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

  // Get step label based on edit mode
  const getStepLabel = (step: Step) => {
    if (editingStoryId) {
      return {
        setup: "Edit Story",
        builder: "Edit Story",
        publish: "Review & Update",
      }[step];
    }
    return stepLabels[step];
  };

  return (
    <>
      <SEOHead
        title={editingStoryId ? "Edit Your Story | Ketravelan" : "Share Your Story | Ketravelan"}
        description="Share your travel experiences with the Ketravelan community. Write about your adventures, lessons learned, and tips for fellow travelers."
      />
      
      <AppLayout>
        {/* Step Sub-Header (sticky within content) */}
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/95 backdrop-blur-sm border-b border-border/50 -mt-4 mb-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-foreground">{getStepLabel(currentStep)}</h1>
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

        {/* Draft Banner */}
        {showDraftBanner && (
          <DraftBanner
            lastSaved={draft.lastSaved}
            onResume={handleResumeDraft}
            onStartFresh={handleStartFresh}
          />
        )}
        
        {/* Step Content */}
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
            addInlineMedia={addInlineMedia}
            updateInlineMedia={updateInlineMedia}
            removeInlineMedia={removeInlineMedia}
            toggleSocialLink={toggleSocialLink}
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
            isEditing={!!editingStoryId}
          />
        )}
      </AppLayout>

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

export default CreateStoryContent;
