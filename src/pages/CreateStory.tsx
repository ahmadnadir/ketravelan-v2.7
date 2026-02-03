import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StorySetupStep } from "@/components/story-builder/StorySetupStep";
import { StoryBuilder } from "@/components/story-builder/StoryBuilder";
import { PublishStep } from "@/components/story-builder/PublishStep";
import { DraftPickerDialog } from "@/components/story-builder/DraftPickerDialog";
import { useStoryDrafts, StoryDraft } from "@/hooks/useStoryDrafts";
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
  publish: "Story Preview",
};

function CreateStoryContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { publishStory, updateStory, getStoryById } = useCommunity();
  
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const {
    drafts,
    activeDraft,
    activeDraftId,
    isLoaded,
    hasDrafts,
    createDraft,
    selectDraft,
    updateActiveDraft,
    deleteDraft,
    clearActiveDraft,
    addInlineMedia,
    updateInlineMedia,
    removeInlineMedia,
    toggleSocialLink,
  } = useStoryDrafts();

  // Check for edit mode from URL
  useEffect(() => {
    if (!isLoaded || initialized) return;
    
    const storyId = searchParams.get("edit");
    if (storyId) {
      const existingStory = getStoryById(storyId);
      if (existingStory && existingStory.author.id === "current-user") {
        setEditingStoryId(storyId);
        
        // Create a new draft from the existing story
        const newDraft = createDraft();
        
        // Convert story inline media back to draft format
        const draftInlineMedia = (existingStory.inlineMedia || []).map((media) => ({
          id: media.id,
          type: media.type as "image" | "gallery",
          images: media.images,
          insertPosition: media.insertPosition,
        }));
        
        // Load story data into draft
        updateActiveDraft({
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
        setInitialized(true);
        return;
      }
    }

    // Check for draftId param (coming from My Stories page)
    const draftId = searchParams.get("draftId");
    if (draftId) {
      const selectedDraft = selectDraft(draftId);
      if (selectedDraft) {
        // Go to appropriate step based on draft content
        if (selectedDraft.content.trim().length > 0 || selectedDraft.title) {
          setCurrentStep("builder");
        }
        setInitialized(true);
        return;
      }
    }

    // Check for linked trip from URL
    const tripId = searchParams.get("tripId");
    if (tripId) {
      // Create a new draft with linked trip
      createDraft();
      updateActiveDraft({ linkedTripId: tripId });
      setInitialized(true);
      return;
    }

    // Show draft picker if user has drafts, otherwise create new draft
    if (hasDrafts) {
      setShowDraftPicker(true);
    } else {
      createDraft();
    }
    setInitialized(true);
  }, [isLoaded, initialized, searchParams, getStoryById, hasDrafts, createDraft, selectDraft, updateActiveDraft]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/create-story");
    }
  }, [isAuthenticated, navigate]);

  // Determine the return destination based on where the user came from
  const getReturnDestination = () => {
    const fromDraft = searchParams.get("draftId");
    const fromSource = searchParams.get("from");
    
    if (fromDraft || fromSource === "drafts") {
      return "/my-stories?tab=drafts";
    }
    // Default to community stories tab
    return "/community?tab=stories";
  };

  const handleBack = () => {
    if (currentStep === "setup") {
      // Check if there's unsaved content
      if (activeDraft?.title || (activeDraft?.content?.trim().length ?? 0) > 0) {
        setShowExitDialog(true);
      } else {
        // Delete empty draft and go back
        if (activeDraftId) {
          deleteDraft(activeDraftId);
        }
        navigate(getReturnDestination());
      }
    } else if (currentStep === "builder") {
      setCurrentStep("setup");
    } else if (currentStep === "publish") {
      setCurrentStep("builder");
    }
  };

  const handleClose = () => {
    if (activeDraft?.title || (activeDraft?.content?.trim().length ?? 0) > 0) {
      setShowExitDialog(true);
    } else {
      // Delete empty draft and go back
      if (activeDraftId) {
        deleteDraft(activeDraftId);
      }
      navigate(getReturnDestination());
    }
  };

  const handleSetupComplete = (data: Partial<StoryDraft>) => {
    updateActiveDraft(data);
    setCurrentStep("builder");
  };

  const handleBuilderComplete = () => {
    setCurrentStep("publish");
  };

  const handlePublish = () => {
    if (!activeDraft) return;
    
    if (editingStoryId) {
      // Update existing story
      const updatedStory = updateStory(editingStoryId, activeDraft);
      if (updatedStory) {
        clearActiveDraft();
        toast.success("Story updated successfully!");
        navigate(`/community/stories/${updatedStory.slug}`);
      }
    } else {
      // Create new story
      const newStory = publishStory(activeDraft);
      clearActiveDraft();
      toast.success("Story published successfully!");
      navigate(`/community/stories/${newStory.slug}`);
    }
  };

  const handleSaveAsDraft = () => {
    // Draft is already saved via auto-save
    toast.success("Story saved as draft");
    navigate("/community");
  };

  const handleDraftSelect = (draftId: string) => {
    selectDraft(draftId);
    setShowDraftPicker(false);
    // Go to appropriate step based on draft content
    const selectedDraft = drafts.find(d => d.id === draftId);
    if (selectedDraft && (selectedDraft.content.trim().length > 0 || selectedDraft.title)) {
      setCurrentStep("builder");
    }
  };

  const handleStartFresh = () => {
    createDraft();
    setShowDraftPicker(false);
  };

  const handleDeleteDraftFromPicker = (draftId: string) => {
    deleteDraft(draftId);
    // If no more drafts, close picker and create new
    if (drafts.length <= 1) {
      setShowDraftPicker(false);
      createDraft();
    }
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    navigate(getReturnDestination());
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

  // Use activeDraft for rendering
  const draft = activeDraft || {
    id: "",
    title: "",
    storyType: null,
    storyFocuses: [],
    travelStyles: [],
    customStoryTypes: [],
    customTravelStyles: [],
    country: "",
    city: "",
    linkedTripId: null,
    coverImage: null,
    content: "",
    contentAfterMedia: "",
    inlineMedia: [],
    selectedSocialLinks: [],
    blocks: [],
    visibility: "public" as const,
    socialLinks: [],
    lastSaved: new Date(),
    createdAt: new Date(),
  };

  // Show loading until drafts are loaded
  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <SEOHead
        title={editingStoryId ? "Edit Your Story | Ketravelan" : "Share Your Story | Ketravelan"}
        description="Share your travel experiences with the Ketravelan community. Write about your adventures, lessons learned, and tips for fellow travelers."
      />
      
      {/* Draft Picker Dialog */}
      <DraftPickerDialog
        open={showDraftPicker}
        onOpenChange={setShowDraftPicker}
        drafts={drafts}
        onSelectDraft={handleDraftSelect}
        onStartFresh={handleStartFresh}
        onDeleteDraft={handleDeleteDraftFromPicker}
      />
      
      <AppLayout>
        {/* Step Sub-Header (sticky within content) */}
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background -mt-4 mb-4">
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
            saveDraft={updateActiveDraft}
            addInlineMedia={addInlineMedia}
            updateInlineMedia={updateInlineMedia}
            removeInlineMedia={removeInlineMedia}
            toggleSocialLink={toggleSocialLink}
            onComplete={handleBuilderComplete}
            onSaveAsDraft={handleSaveAsDraft}
          />
        )}
        
        {currentStep === "publish" && (
          <PublishStep
            draft={draft}
            saveDraft={updateActiveDraft}
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

export default function CreateStory() {
  return <CreateStoryContent />;
}
