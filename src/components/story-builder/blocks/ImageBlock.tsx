import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StoryBlock, blockTypeConfig } from "@/data/communityMockData";

interface ImageBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
}

export function ImageBlock({ block, onUpdate }: ImageBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate({ imageUrl: url });
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      {block.imageUrl ? (
        <div className="relative group">
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={block.imageUrl}
              alt="Block image"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
          >
            <span className="text-white text-sm font-medium">Change Image</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
        >
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Upload image</span>
        </button>
      )}
      
      <Input
        value={block.caption || ""}
        onChange={(e) => onUpdate({ caption: e.target.value })}
        placeholder={blockTypeConfig.image.placeholder}
        className="text-sm"
      />
    </div>
  );
}
