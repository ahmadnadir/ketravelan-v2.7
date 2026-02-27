import { useRef } from "react";
import { Bold, Underline, List, ListOrdered, AtSign, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";

interface EditingToolbarProps {
  editor: Editor | null;
  onAddGallery: (files: File[]) => void;
  onOpenSocialSheet: () => void;
}

export function EditingToolbar({
  editor,
  onAddGallery,
  onOpenSocialSheet,
}: EditingToolbarProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddGallery(Array.from(files));
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  const btnClass = (active: boolean) =>
    `h-9 w-9 p-0 ${active ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="flex items-center justify-center gap-1 py-2 border-b border-border/50">
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
        className={btnClass(editor?.isActive("bold") ?? false)}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={btnClass(editor?.isActive("underline") ?? false)}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={btnClass(editor?.isActive("bulletList") ?? false)}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={btnClass(editor?.isActive("orderedList") ?? false)}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
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
