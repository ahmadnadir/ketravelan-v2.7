import { useRef } from "react";
import { Image, Images, AtSign, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomActionBarProps {
  onAddPhoto: (file: File) => void;
  onAddGallery: (files: File[]) => void;
  onOpenSocialSheet: () => void;
}

export function BottomActionBar({
  onAddPhoto,
  onAddGallery,
  onOpenSocialSheet,
}: BottomActionBarProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddPhoto(file);
    }
    // Reset input
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddGallery(Array.from(files));
    }
    // Reset input
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-muted/50 border-t border-border">
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoSelect}
      />
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
        className="h-10 w-10 p-0"
        onClick={() => photoInputRef.current?.click()}
        title="Add Photo"
      >
        <Image className="h-5 w-5 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0"
        onClick={() => galleryInputRef.current?.click()}
        title="Add Gallery"
      >
        <Images className="h-5 w-5 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0"
        onClick={onOpenSocialSheet}
        title="Add Social Link"
      >
        <AtSign className="h-5 w-5 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0"
        disabled
        title="More options (coming soon)"
      >
        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
}
