import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryDraft, InlineMedia, UserSocialProfile } from "@/hooks/useStoryDraft";
import { FloatingToolbar, FormatType } from "./FloatingToolbar";
import { BottomActionBar } from "./BottomActionBar";
import { SocialLinkSheet } from "./SocialLinkSheet";
import { InlineImage } from "./InlineImage";
import { InlineGallery } from "./InlineGallery";
import { SocialLinksCard } from "./SocialLinksCard";

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
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-grow textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
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
      case "link": {
        const url = prompt("Enter URL:");
        if (url) {
          newText = `${beforeText}[${selectedText}](${url})${afterText}`;
          newCursorPos = end + url.length + 4;
        } else {
          return;
        }
        break;
      }
    }

    saveDraft({ content: newText });
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleAddPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    const newMedia: InlineMedia = {
      id: `media-${Date.now()}`,
      type: "image",
      images: [{ url }],
      insertPosition: draft.content.length,
    };
    addInlineMedia(newMedia);
  };

  const handleAddGallery = (files: File[]) => {
    const images = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));
    const newMedia: InlineMedia = {
      id: `media-${Date.now()}`,
      type: "gallery",
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
    <div className="flex flex-col h-full">
      {/* Floating Toolbar */}
      <FloatingToolbar textareaRef={textareaRef} onFormat={handleFormat} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-48 space-y-6">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Cover Image</p>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageSelect}
            className="hidden"
          />
          {draft.coverImage ? (
            <div className="relative group">
              <div className="aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={draft.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
              >
                <span className="text-white font-medium">Change Cover</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload cover image
              </span>
            </button>
          )}
        </div>

        {/* Story Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <p className="font-medium text-foreground">{draft.title}</p>
          <p className="text-sm text-muted-foreground">
            {draft.country}{draft.city && `, ${draft.city}`}
          </p>
        </div>

        {/* Main Writing Area */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Your Story</p>
          <textarea
            ref={textareaRef}
            value={draft.content}
            onChange={handleContentChange}
            placeholder="Start writing your story…"
            className="w-full min-h-[200px] max-h-[400px] p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground leading-relaxed"
            style={{ overflow: "auto" }}
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

        {/* Social Links Card */}
        <SocialLinksCard
          links={draft.selectedSocialLinks}
          onRemoveLink={toggleSocialLink}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 bg-background border-t border-border">
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          <BottomActionBar
            onAddPhoto={handleAddPhoto}
            onAddGallery={handleAddGallery}
            onOpenSocialSheet={() => setShowSocialSheet(true)}
          />
          
          {/* Continue Button */}
          <div className="px-4 pb-4">
            <Button
              onClick={onComplete}
              disabled={!isValid}
              className="w-full gap-2"
              size="lg"
            >
              Review & Publish
              <ChevronRight className="h-4 w-4" />
            </Button>
            {!isValid && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Add a cover image and start writing your story
              </p>
            )}
          </div>
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
