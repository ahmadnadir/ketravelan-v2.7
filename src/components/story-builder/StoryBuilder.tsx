import { useState, useRef, useCallback } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StoryDraft, InlineMedia, UserSocialProfile } from "@/hooks/useStoryDrafts";
import { EditingToolbar } from "./EditingToolbar";
import { RichTextEditor } from "./RichTextEditor";
import { SocialLinkSheet } from "./SocialLinkSheet";
import { InlineImage } from "./InlineImage";
import { InlineGallery } from "./InlineGallery";
import { SocialLinksInline } from "./SocialLinksInline";
import type { Editor } from "@tiptap/react";

interface StoryBuilderProps {
  draft: StoryDraft;
  saveDraft: (updates: Partial<StoryDraft>) => void;
  addInlineMedia: (media: InlineMedia) => void;
  updateInlineMedia: (mediaId: string, updates: Partial<InlineMedia>) => void;
  removeInlineMedia: (mediaId: string) => void;
  toggleSocialLink: (profile: UserSocialProfile) => void;
  onComplete: () => void;
  onSaveAsDraft: () => void;
}

export function StoryBuilder({
  draft,
  saveDraft,
  addInlineMedia,
  updateInlineMedia,
  removeInlineMedia,
  toggleSocialLink,
  onComplete,
  onSaveAsDraft,
}: StoryBuilderProps) {
  const [showSocialSheet, setShowSocialSheet] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleEditorReady = useCallback((ed: Editor) => {
    setEditor(ed);
  }, []);

  const handleContentUpdate = useCallback(
    (html: string) => {
      saveDraft({ content: html });
    },
    [saveDraft]
  );

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      saveDraft({ coverImage: url });
    }
  };

  const handleAddGallery = (files: File[]) => {
    const images = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));
    const newMedia: InlineMedia = {
      id: `media-${Date.now()}`,
      type: files.length === 1 ? "image" : "gallery",
      images,
      insertPosition: draft.content.length,
    };
    addInlineMedia(newMedia);
  };

  const handleUpdateMediaCaption = (mediaId: string, imageIndex: number, caption: string) => {
    const media = draft.inlineMedia.find((m) => m.id === mediaId);
    if (!media) return;

    const updatedImages = [...media.images];
    updatedImages[imageIndex] = { ...updatedImages[imageIndex], caption };
    updateInlineMedia(mediaId, { images: updatedImages });
  };

  const handleContinueClick = () => {
    if (!draft.coverImage) {
      toast.error("Please add a cover image to continue");
      document.getElementById("cover-input")?.click();
      return;
    }
    // Strip HTML to check if there's actual text content
    const textContent = draft.content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      toast.error("Please write something about your experience");
      editor?.commands.focus();
      return;
    }
    onComplete();
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Editorial Canvas */}
      <div className="flex-1 px-4 sm:px-6 pb-32">
        {/* Cover Image - full bleed, editorial style */}
        <div className="-mx-4 sm:-mx-6 mb-4">
          <input
            id="cover-input"
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageSelect}
            className="hidden"
          />
          {draft.coverImage ? (
            <div className="relative group">
              <div className="aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={draft.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="cover-input"
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-white font-medium text-lg">Change Cover</span>
              </label>
            </div>
          ) : (
            <label
              htmlFor="cover-input"
              className="w-full aspect-[16/9] sm:aspect-[21/9] bg-muted/30 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
              <span className="text-muted-foreground">
                Add cover image
              </span>
            </label>
          )}
        </div>

        {/* Story Title - editorial display */}
        <header className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
            {draft.title || "Untitled Story"}
          </h1>
          {(draft.country || draft.city) && (
            <p className="text-lg text-muted-foreground">
              {draft.city && `${draft.city}, `}{draft.country}
            </p>
          )}
        </header>

        {/* Sticky Editing Toolbar */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background">
          <EditingToolbar
            editor={editor}
            onAddGallery={handleAddGallery}
            onOpenSocialSheet={() => setShowSocialSheet(true)}
          />
        </div>

        {/* Main Writing Canvas - TipTap WYSIWYG Editor */}
        <div className="relative tiptap-wrapper mt-2">
          <RichTextEditor
            content={draft.content}
            onUpdate={handleContentUpdate}
            onEditorReady={handleEditorReady}
          />
        </div>

        {/* Inline Media */}
        {draft.inlineMedia.map((media) => (
          media.type === "image" ? (
            <InlineImage
              key={media.id}
              media={media}
              onUpdateCaption={(caption) => handleUpdateMediaCaption(media.id, 0, caption)}
              onRemove={() => removeInlineMedia(media.id)}
            />
          ) : (
            <InlineGallery
              key={media.id}
              media={media}
              onUpdateImage={(index, updates) => {
                const updatedImages = [...media.images];
                updatedImages[index] = { ...updatedImages[index], ...updates };
                updateInlineMedia(media.id, { images: updatedImages });
              }}
              onRemove={() => removeInlineMedia(media.id)}
            />
          )
        ))}

        {/* Social Links - plain text, editorial style */}
        <SocialLinksInline
          links={draft.selectedSocialLinks}
          onRemoveLink={toggleSocialLink}
        />
      </div>

      {/* Bottom CTA - sticky bar above bottom nav */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 z-40">
        <div className="container max-w-3xl mx-auto flex gap-3">
          <Button
            onClick={onSaveAsDraft}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Save as Draft
          </Button>
          <Button
            onClick={handleContinueClick}
            className="flex-1 gap-2"
            size="lg"
          >
            Preview
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Social Link Sheet */}
      <SocialLinkSheet
        open={showSocialSheet}
        onOpenChange={setShowSocialSheet}
        selectedLinks={draft.selectedSocialLinks}
        onToggleLink={toggleSocialLink}
      />
    </div>
  );
}
