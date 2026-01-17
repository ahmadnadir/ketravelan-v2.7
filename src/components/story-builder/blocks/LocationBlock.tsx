import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StoryBlock, blockTypeConfig } from "@/data/communityMockData";

interface LocationBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
}

export function LocationBlock({ block, onUpdate }: LocationBlockProps) {
  return (
    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-green-600" />
        <Input
          value={block.locationName || ""}
          onChange={(e) => onUpdate({ locationName: e.target.value })}
          placeholder="Location name"
          className="h-8 text-sm border-0 bg-transparent p-0 focus-visible:ring-0 font-medium"
        />
      </div>
      <Textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder={blockTypeConfig.location.placeholder}
        className="min-h-[60px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
      />
    </div>
  );
}
