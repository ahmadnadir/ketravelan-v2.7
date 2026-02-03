import { Bold, Underline, List, ListOrdered, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FormatType = "bold" | "underline" | "bullet" | "numbered";

interface EditingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onFormat: (type: FormatType) => void;
  onOpenSocialSheet: () => void;
}

export function EditingToolbar({
  textareaRef,
  onFormat,
  onOpenSocialSheet,
}: EditingToolbarProps) {
  const handleFormat = (type: FormatType) => {
    onFormat(type);
    // Refocus textarea after formatting
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <div className="flex items-center gap-1 py-3 border-b border-border/50 mb-6">
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
        onClick={onOpenSocialSheet}
        title="Add Social Links"
      >
        <AtSign className="h-4 w-4" />
      </Button>
    </div>
  );
}
