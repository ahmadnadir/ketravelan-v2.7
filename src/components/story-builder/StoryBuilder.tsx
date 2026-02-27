import { useState, useRef, useCallback } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StoryDraft, InlineMedia, UserSocialProfile } from "@/hooks/useStoryDrafts";
import { EditorBlock, createImageBlock, createGalleryBlock, insertMediaBlock, createTextBlock } from "@/lib/storyEditorBlocks";
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
  // Track which block the user last interacted with for insertion
  const [activeBlockId, setActiveBlockId] = useState<string | null>(
    draft.editorBlocks[0]?.id ?? null
  );
  // Map of block id -> TipTap Editor instances
  const editorsRef = useRef<Map<string, Editor>>(new Map());
  const coverInputRef = useRef<HTMLInputElement>(null);

  const blocks = draft.editorBlocks;

  // Get the editor instance for the active text block (for toolbar)
  const activeEditor = activeBlockId ? editorsRef.current.get(activeBlockId) ?? null : null;

  const handleEditorReady = useCallback((blockId: string, ed: Editor) => {
    editorsRef.current.set(blockId, ed);
  }, []);

  const handleBlockContentUpdate = useCallback(
    (blockId: string, html: string) => {
      const newBlocks = blocks.map((b) =>
        b.id === blockId && b.type === "text" ? { ...b, content: html } : b
      );
      saveDraft({ editorBlocks: newBlocks });
    },
    [blocks, saveDraft]
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
    const mediaBlock =
      files.length === 1
        ? createImageBlock(images)
        : createGalleryBlock(images);

    const newBlocks = insertMediaBlock(blocks, activeBlockId, mediaBlock);
    saveDraft({ editorBlocks: newBlocks });
  };

  const handleUpdateMediaCaption = (blockId: string, imageIndex: number, caption: string) => {
    const newBlocks = blocks.map((b) => {
      if (b.id !== blockId || b.type === "text") return b;
      const updatedImages = [...b.images];
      updatedImages[imageIndex] = { ...updatedImages[imageIndex], caption };
      return { ...b, images: updatedImages };
    });
    saveDraft({ editorBlocks: newBlocks });
  };

  const handleRemoveBlock = (blockId: string) => {
    // Remove the media block. If the next block is an empty text block and the previous
    // is also a text block, merge them (remove the trailing empty text block).
    let newBlocks = blocks.filter((b) => b.id !== blockId);
    // Clean up consecutive text blocks
    const cleaned: EditorBlock[] = [];
    for (const b of newBlocks) {
      const prev = cleaned[cleaned.length - 1];
      if (prev && prev.type === "text" && b.type === "text" && !b.content.trim()) {
        // Skip empty trailing text block
        continue;
      }
      cleaned.push(b);
    }
    if (cleaned.length === 0) {
      cleaned.push(createTextBlock());
    }
    saveDraft({ editorBlocks: cleaned });
  };

  const handleContinueClick = () => {
    if (!draft.coverImage) {
      toast.error("Please add a cover image to continue");
      document.getElementById("cover-input")?.click();
      return;
    }
    // Check if there's actual text content in any text block
    const hasText = blocks.some(
      (b) => b.type === "text" && b.content.replace(/<[^>]*>/g, "").trim()
    );
    if (!hasText) {
      toast.error("Please write something about your experience");
      // Focus the first text block
      const firstTextBlock = blocks.find((b) => b.type === "text");
      if (firstTextBlock) {
        editorsRef.current.get(firstTextBlock.id)?.commands.focus();
      }
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
        <header className="mb-2 text-center">
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
            editor={activeEditor}
            onAddGallery={handleAddGallery}
            onOpenSocialSheet={() => setShowSocialSheet(true)}
          />
        </div>

        {/* Block-based content */}
        <div className="mt-2">
          {blocks.map((block) => {
            if (block.type === "text") {
              return (
                <div
                  key={block.id}
                  onFocus={() => setActiveBlockId(block.id)}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  <RichTextEditor
                    content={block.content}
                    onUpdate={(html) => handleBlockContentUpdate(block.id, html)}
                    onEditorReady={(ed) => handleEditorReady(block.id, ed)}
                  />
                </div>
              );
            }

            if (block.type === "image") {
              return (
                <div
                  key={block.id}
                  onFocus={() => setActiveBlockId(block.id)}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  <InlineImage
                    media={{ id: block.id, type: "image", images: block.images, insertPosition: 0 }}
                    onUpdateCaption={(caption) => handleUpdateMediaCaption(block.id, 0, caption)}
                    onRemove={() => handleRemoveBlock(block.id)}
                  />
                </div>
              );
            }

            if (block.type === "gallery") {
              return (
                <div
                  key={block.id}
                  onFocus={() => setActiveBlockId(block.id)}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  <InlineGallery
                    media={{ id: block.id, type: "gallery", images: block.images, insertPosition: 0 }}
                    onUpdateImage={(index, updates) => {
                      const newBlocks = blocks.map((b) => {
                        if (b.id !== block.id || b.type === "text") return b;
                        const updatedImages = [...b.images];
                        updatedImages[index] = { ...updatedImages[index], ...updates };
                        return { ...b, images: updatedImages };
                      });
                      saveDraft({ editorBlocks: newBlocks });
                    }}
                    onRemove={() => handleRemoveBlock(block.id)}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

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
