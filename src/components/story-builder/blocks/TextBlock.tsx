import { Textarea } from "@/components/ui/textarea";
import { StoryBlock, blockTypeConfig } from "@/data/communityMockData";

interface TextBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
}

export function TextBlock({ block, onUpdate }: TextBlockProps) {
  return (
    <Textarea
      value={block.content}
      onChange={(e) => onUpdate({ content: e.target.value })}
      placeholder={blockTypeConfig.text.placeholder}
      className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
    />
  );
}
