import { useState, useRef } from "react";
import { Plus, ChevronRight, Image as ImageIcon, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoryDraft } from "@/hooks/useStoryDraft";
import { StoryBlock, BlockType, blockTypeConfig } from "@/data/communityMockData";
import { AddBlockSheet } from "./AddBlockSheet";
import { TextBlock } from "./blocks/TextBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { LocationBlock } from "./blocks/LocationBlock";
import { SocialLinkBlock } from "./blocks/SocialLinkBlock";

interface StoryBuilderProps {
  draft: StoryDraft;
  saveDraft: (updates: Partial<StoryDraft>) => void;
  addBlock: (block: StoryBlock) => void;
  updateBlock: (blockId: string, updates: Partial<StoryBlock>) => void;
  removeBlock: (blockId: string) => void;
  reorderBlocks: (blocks: StoryBlock[]) => void;
  onComplete: () => void;
}

export function StoryBuilder({
  draft,
  saveDraft,
  addBlock,
  updateBlock,
  removeBlock,
  reorderBlocks,
  onComplete,
}: StoryBuilderProps) {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      saveDraft({ coverImage: url });
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: StoryBlock = {
      id: `block-${Date.now()}`,
      type,
      content: "",
    };
    addBlock(newBlock);
    setShowAddSheet(false);
  };

  const handleDragStart = (blockId: string) => {
    setDraggedId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const blocks = [...draft.blocks];
    const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
    const targetIndex = blocks.findIndex((b) => b.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedBlock] = blocks.splice(draggedIndex, 1);
      blocks.splice(targetIndex, 0, draggedBlock);
      reorderBlocks(blocks);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const renderBlock = (block: StoryBlock) => {
    const commonProps = {
      block,
      onUpdate: (updates: Partial<StoryBlock>) => updateBlock(block.id, updates),
      onRemove: () => removeBlock(block.id),
    };

    switch (block.type) {
      case "text":
        return <TextBlock {...commonProps} />;
      case "image":
        return <ImageBlock {...commonProps} />;
      // Legacy compatibility (older stories/drafts)
      case "moment":
        return (
          <TextBlock
            {...commonProps}
            block={{ ...block, type: "text", textPrompt: block.textPrompt ?? "what-happened" }}
          />
        );
      case "lesson":
        return (
          <TextBlock
            {...commonProps}
            block={{ ...block, type: "text", textPrompt: block.textPrompt ?? "lesson" }}
          />
        );
      case "tip":
        return (
          <TextBlock
            {...commonProps}
            block={{ ...block, type: "text", textPrompt: block.textPrompt ?? "tip" }}
          />
        );
      case "location":
        return <LocationBlock {...commonProps} />;
      case "social-link":
        return <SocialLinkBlock {...commonProps} />;
      default:
        return null;
    }
  };

  const isValid = draft.coverImage && draft.blocks.length > 0;

  return (
    <div className="p-4 space-y-6 pb-40">
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

      {/* Blocks */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Story Content</p>
        
        {draft.blocks.length === 0 ? (
          <Card className="p-6 text-center border-dashed">
            <p className="text-muted-foreground mb-3">
              Start building your story by adding blocks
            </p>
            <Button
              variant="outline"
              onClick={() => setShowAddSheet(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Block
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {draft.blocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block.id)}
                onDragOver={(e) => handleDragOver(e, block.id)}
                onDragEnd={handleDragEnd}
                className={`relative ${
                  draggedId === block.id ? "opacity-50" : ""
                }`}
              >
                <Card className="overflow-hidden">
                  {/* Block Header */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border/50">
                    <button
                      className="cursor-grab active:cursor-grabbing touch-none"
                      onTouchStart={() => handleDragStart(block.id)}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <span className="text-sm font-medium flex-1">
                      {blockTypeConfig[block.type].icon} {blockTypeConfig[block.type].label}
                    </span>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Block Content */}
                  <div className="p-3">
                    {renderBlock(block)}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Block Button */}
      {draft.blocks.length > 0 && (
        <Button
          variant="outline"
          onClick={() => setShowAddSheet(true)}
          className="w-full gap-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
          Add Block
        </Button>
      )}

      {/* Add Block Sheet */}
      <AddBlockSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        onSelectBlock={handleAddBlock}
      />

      {/* Continue Button - Fixed at bottom */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="container max-w-3xl mx-auto">
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
              Add a cover image and at least one content block
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
