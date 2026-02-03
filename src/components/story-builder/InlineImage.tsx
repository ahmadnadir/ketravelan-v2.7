import { useState } from "react";
import { X, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InlineMedia } from "@/hooks/useStoryDraft";

interface InlineImageProps {
  media: InlineMedia;
  onUpdateCaption: (caption: string) => void;
  onRemove: () => void;
}

export function InlineImage({ media, onUpdateCaption, onRemove }: InlineImageProps) {
  const [showCaption, setShowCaption] = useState(!!media.images[0]?.caption);
  const image = media.images[0];

  if (!image) return null;

  return (
    <div className="relative my-4 group">
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={image.url}
          alt={image.caption || "Story image"}
          className="w-full h-auto object-cover max-h-80"
        />
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Caption area */}
      {showCaption ? (
        <div className="mt-2">
          <Input
            value={image.caption || ""}
            onChange={(e) => onUpdateCaption(e.target.value)}
            placeholder="Add a caption..."
            className="text-sm border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 bg-transparent"
          />
        </div>
      ) : (
        <button
          onClick={() => setShowCaption(true)}
          className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Add caption</span>
        </button>
      )}
    </div>
  );
}
