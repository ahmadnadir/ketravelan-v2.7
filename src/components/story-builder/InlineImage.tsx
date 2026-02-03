import { X } from "lucide-react";
import { InlineMedia } from "@/hooks/useStoryDraft";

interface InlineImageProps {
  media: InlineMedia;
  onUpdateCaption: (caption: string) => void;
  onRemove: () => void;
}

export function InlineImage({ media, onUpdateCaption, onRemove }: InlineImageProps) {
  const image = media.images[0];

  if (!image) return null;

  return (
    <div className="relative my-8 group">
      {/* Image - borderless, editorial style */}
      <div className="relative">
        <img
          src={image.url}
          alt={image.caption || "Story image"}
          className="w-full h-auto object-cover"
        />
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Caption - always visible */}
      <input
        type="text"
        value={image.caption || ""}
        onChange={(e) => onUpdateCaption(e.target.value)}
        placeholder="Add a caption..."
        className="w-full mt-2 text-sm text-muted-foreground text-center bg-transparent border-none outline-none placeholder:text-muted-foreground/50 italic"
      />
    </div>
  );
}
