import { useRef, useEffect } from "react";
import { List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryBlock } from "@/data/communityMockData";

interface TextBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
}

export function TextBlock({ block, onUpdate }: TextBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + "px";
    }
  }, [block.content]);

  // Insert list marker at cursor
  const insertListMarker = (marker: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = block.content || "";
    
    // Find line start
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    
    // Insert marker at line start
    const newText = text.slice(0, lineStart) + marker + text.slice(lineStart);
    onUpdate({ content: newText });
    
    // Restore cursor position (after marker)
    setTimeout(() => {
      const newPos = start + marker.length;
      textarea.setSelectionRange(newPos, newPos + (end - start));
      textarea.focus();
    }, 0);
  };

  const handleBullet = () => insertListMarker("• ");
  const handleNumbered = () => {
    // Count existing numbered items to determine next number
    const lines = (block.content || "").split("\n");
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorLine = (block.content || "")
      .slice(0, textarea.selectionStart)
      .split("\n").length - 1;
    
    // Find last numbered item before cursor
    let lastNum = 0;
    for (let i = cursorLine; i >= 0; i--) {
      const match = lines[i].match(/^(\d+)\. /);
      if (match) {
        lastNum = parseInt(match[1]);
        break;
      }
    }
    
    insertListMarker(`${lastNum + 1}. `);
  };

  return (
    <div className="space-y-2">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBullet}
          className="h-8 w-8 p-0"
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNumbered}
          className="h-8 w-8 p-0"
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea with auto-grow */}
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Write your story..."
        className="w-full min-h-[120px] max-h-[400px] px-4 py-3 text-base 
                   bg-muted/30 rounded-lg border border-border/50
                   placeholder:text-muted-foreground
                   focus:outline-none focus:border-primary/50 focus:bg-background
                   resize-y transition-colors"
      />
      
      {/* Optional hint */}
      <p className="text-xs text-muted-foreground">
        Tip: Type "• " or "1. " to start a list
      </p>
    </div>
  );
}
