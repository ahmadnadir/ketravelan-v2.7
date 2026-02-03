import { useRef, useState } from "react";
import { Plus, Images, AtSign } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InlineInsertMenuProps {
  visible: boolean;
  position: { top: number };
  onAddGallery: (files: File[]) => void;
  onOpenSocialSheet: () => void;
}

export function InlineInsertMenu({
  visible,
  position,
  onAddGallery,
  onOpenSocialSheet,
}: InlineInsertMenuProps) {
  const [open, setOpen] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddGallery(Array.from(files));
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
    setOpen(false);
  };

  const handleSocialClick = () => {
    onOpenSocialSheet();
    setOpen(false);
  };

  if (!visible) return null;

  return (
    <div
      className="absolute left-0 z-40 transition-opacity duration-150"
      style={{ top: `${position.top}px`, transform: "translateX(-100%) translateX(-8px)" }}
    >
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleGallerySelect}
      />
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="h-7 w-7 flex items-center justify-center rounded-full border border-border/50 text-muted-foreground/50 hover:text-muted-foreground hover:border-border hover:bg-muted/30 transition-all"
          >
            <Plus className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side="right" 
          align="start" 
          sideOffset={8}
          className="w-auto p-1.5"
        >
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left"
            >
              <Images className="h-4 w-4 text-muted-foreground" />
              <span>Add Gallery</span>
            </button>
            <button
              onClick={handleSocialClick}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors text-left"
            >
              <AtSign className="h-4 w-4 text-muted-foreground" />
              <span>Add Social Links</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
