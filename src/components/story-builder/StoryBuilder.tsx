import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryDraft, InlineMedia, UserSocialProfile } from "@/hooks/useStoryDraft";
import { EditingToolbar, FormatType } from "./EditingToolbar";
import { SocialLinkSheet } from "./SocialLinkSheet";
import { InlineImage } from "./InlineImage";
import { InlineGallery } from "./InlineGallery";
import { SocialLinksInline } from "./SocialLinksInline";

interface StoryBuilderProps {
  draft: StoryDraft;
  saveDraft: (updates: Partial<StoryDraft>) => void;
  addInlineMedia: (media: InlineMedia) => void;
  updateInlineMedia: (mediaId: string, updates: Partial<InlineMedia>) => void;
  removeInlineMedia: (mediaId: string) => void;
  toggleSocialLink: (profile: UserSocialProfile) => void;
  onComplete: () => void;
}

export function StoryBuilder({
  draft,
  saveDraft,
  addInlineMedia,
  updateInlineMedia,
  removeInlineMedia,
  toggleSocialLink,
  onComplete,
}: StoryBuilderProps) {
  const [showSocialSheet, setShowSocialSheet] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-grow textarea - no max height for editorial feel
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [draft.content, adjustTextareaHeight]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveDraft({ content: e.target.value });
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      saveDraft({ coverImage: url });
    }
  };

  const handleFormat = (type: FormatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = "";
    let newCursorPos = start;

    switch (type) {
      case "bold":
        newText = `${beforeText}**${selectedText}**${afterText}`;
        newCursorPos = end + 4;
        break;
      case "underline":
        newText = `${beforeText}__${selectedText}__${afterText}`;
        newCursorPos = end + 4;
        break;
      case "bullet": {
        const lines = selectedText.split("\n").map((line) => `• ${line}`);
        newText = `${beforeText}${lines.join("\n")}${afterText}`;
        newCursorPos = start + lines.join("\n").length;
        break;
      }
      case "numbered": {
        const lines = selectedText.split("\n").map((line, i) => `${i + 1}. ${line}`);
        newText = `${beforeText}${lines.join("\n")}${afterText}`;
        newCursorPos = start + lines.join("\n").length;
        break;
      }
    }

    saveDraft({ content: newText });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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

  const isValid = draft.coverImage && draft.content.trim().length > 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* Editorial Canvas */}
      <div className="flex-1 px-4 sm:px-6 pb-32">
        {/* Cover Image - full bleed, editorial style */}
        <div className="-mx-4 sm:-mx-6 mb-8">
          <input
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
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-white font-medium text-lg">Change Cover</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              className="w-full aspect-[16/9] sm:aspect-[21/9] bg-muted/30 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors"
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
              <span className="text-muted-foreground">
                Add cover image
              </span>
            </button>
          )}
        </div>

        {/* Story Title - editorial display */}
        <header className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
            {draft.title || "Untitled Story"}
          </h1>
          {(draft.country || draft.city) && (
            <p className="text-lg text-muted-foreground">
              {draft.city && `${draft.city}, `}{draft.country}
            </p>
          )}
        </header>

        {/* Persistent Editing Toolbar */}
        <EditingToolbar
          textareaRef={textareaRef}
          onFormat={handleFormat}
          onAddGallery={handleAddGallery}
          onOpenSocialSheet={() => setShowSocialSheet(true)}
        />

        {/* Main Writing Canvas - borderless, editorial */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={draft.content}
            onChange={handleContentChange}
            placeholder="Write your experience here"
            className="w-full min-h-[300px] bg-transparent border-none resize-none focus:outline-none text-lg text-foreground placeholder:text-muted-foreground/40"
            style={{ overflow: "hidden", lineHeight: "1.8" }}
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

      {/* Bottom CTA - positioned above bottom nav */}
      <div className="fixed bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl z-40">
        <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-4 flex flex-col items-center gap-2">
          <Button
            onClick={onComplete}
            disabled={!isValid}
            className="px-8 gap-2"
            size="lg"
          >
            Review & Publish
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isValid && (
            <p className="text-xs text-muted-foreground text-center">
              Add a cover image and start writing
            </p>
          )}
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
