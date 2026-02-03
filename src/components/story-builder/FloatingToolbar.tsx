import { useEffect, useRef, useState } from "react";
import { Bold, List, ListOrdered, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FormatType = "bold" | "bullet" | "numbered" | "link";

interface FloatingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onFormat: (type: FormatType) => void;
}

export function FloatingToolbar({ textareaRef, onFormat }: FloatingToolbarProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelectionChange = () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end && document.activeElement === textarea) {
        // Text is selected
        const textareaRect = textarea.getBoundingClientRect();
        
        // Calculate approximate position based on selection
        // For textarea, we use a simplified approach
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
        const paddingTop = parseInt(getComputedStyle(textarea).paddingTop) || 12;
        
        // Count newlines before selection to estimate vertical position
        const textBeforeSelection = textarea.value.substring(0, start);
        const linesBeforeSelection = textBeforeSelection.split("\n").length - 1;
        
        const top = textareaRect.top + paddingTop + (linesBeforeSelection * lineHeight) - 48;
        const left = textareaRect.left + textareaRect.width / 2;
        
        setPosition({
          top: Math.max(top, textareaRect.top - 48),
          left: Math.min(left, window.innerWidth - 100),
        });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    // Listen to both selection and focus events
    textarea.addEventListener("select", handleSelectionChange);
    textarea.addEventListener("mouseup", handleSelectionChange);
    textarea.addEventListener("keyup", handleSelectionChange);
    textarea.addEventListener("blur", () => {
      // Small delay to allow button clicks
      setTimeout(() => setVisible(false), 150);
    });

    return () => {
      textarea.removeEventListener("select", handleSelectionChange);
      textarea.removeEventListener("mouseup", handleSelectionChange);
      textarea.removeEventListener("keyup", handleSelectionChange);
    };
  }, [textareaRef]);

  if (!visible) return null;

  const handleFormat = (type: FormatType) => {
    onFormat(type);
    setVisible(false);
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-0.5 p-1 bg-popover border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleFormat("bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleFormat("bullet")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleFormat("numbered")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleFormat("link")}
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
