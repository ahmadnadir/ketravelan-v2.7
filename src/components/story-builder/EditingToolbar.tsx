import { useRef } from "react";
import { Bold, Underline, List, ListOrdered, AtSign, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FormatType = "bold" | "underline" | "bullet" | "numbered";

interface EditingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onFormat: (type: FormatType) => void;
  onAddGallery: (files: File[]) => void;
  onOpenSocialSheet: () => void;
}

export function EditingToolbar({
  textareaRef,
  onFormat,
  onAddGallery,
  onOpenSocialSheet,
}: EditingToolbarProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFormat = (type: FormatType) => {
    onFormat(type);
    // Refocus textarea after formatting
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddGallery(Array.from(files));
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 py-2 border-b border-border/50 mb-2">
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleGallerySelect}
      />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
        onClick={() => handleFormat("bold")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
        onClick={() => handleFormat("underline")}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
        onClick={() => handleFormat("bullet")}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
        onClick={() => handleFormat("numbered")}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
        onClick={() => galleryInputRef.current?.click()}
        title="Add Gallery"
      >
        <Images className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
        onClick={onOpenSocialSheet}
        title="Add Social Links"
      >
        <AtSign className="h-4 w-4" />
      </Button>
    </div>
  );
}
