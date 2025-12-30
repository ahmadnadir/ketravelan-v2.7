import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Pin, Trash2, Check, List, ListOrdered, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripNote, saveNote, deleteNote } from "@/lib/tripNotes";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note: TripNote | null;
  open: boolean;
  onClose: () => void;
  onSave: (note: TripNote) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

type SaveState = "idle" | "saving" | "saved";

export function NoteEditor({
  note,
  open,
  onClose,
  onSave,
  onDelete,
  onTogglePin,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef(true);
  const lastSavedContent = useRef({ title: "", content: "", isPinned: false });

  // Initialize state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsPinned(note.pinned);
      lastSavedContent.current = { title: note.title, content: note.content, isPinned: note.pinned };
      setSaveState("idle");
      isInitialMount.current = true;
    }
  }, [note]);

  // Focus title on open
  useEffect(() => {
    if (open && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  // Debounced save with proper state management
  useEffect(() => {
    if (!note || !open) return;
    
    // Skip initial mount to avoid saving on load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Check if content actually changed
    const hasChanges = 
      title !== lastSavedContent.current.title ||
      content !== lastSavedContent.current.content ||
      isPinned !== lastSavedContent.current.isPinned;
    
    if (!hasChanges) return;
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set idle while typing (no indicator shown)
    setSaveState("idle");
    
    // Debounce save for 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      setSaveState("saving");
      
      const updatedNote: TripNote = {
        ...note,
        title: title || "Untitled",
        content,
        pinned: isPinned,
        updatedAt: Date.now(),
      };
      
      saveNote(updatedNote);
      onSave(updatedNote);
      
      // Update last saved content
      lastSavedContent.current = { title: title || "Untitled", content, isPinned };
      
      // Brief delay before showing "Saved" for perceived stability
      setTimeout(() => {
        setSaveState("saved");
      }, 150);
      
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, isPinned, note, open, onSave]);

  const handleClose = () => {
    // Save immediately on close if there are unsaved changes
    if (note && (title || content)) {
      const hasChanges = 
        title !== lastSavedContent.current.title ||
        content !== lastSavedContent.current.content ||
        isPinned !== lastSavedContent.current.isPinned;
      
      if (hasChanges) {
        const updatedNote: TripNote = {
          ...note,
          title: title || "Untitled",
          content,
          pinned: isPinned,
          updatedAt: Date.now(),
        };
        saveNote(updatedNote);
        onSave(updatedNote);
      }
    }
    onClose();
  };

  const handlePin = () => {
    if (note) {
      setIsPinned(!isPinned);
      onTogglePin(note.id);
    }
  };

  const handleDelete = () => {
    if (note) {
      deleteNote(note.id);
      onDelete(note.id);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  // Handle title Enter key - move focus to body
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
      // Place cursor at the beginning of content
      contentRef.current?.setSelectionRange(0, 0);
    }
  };

  // Toggle checkbox at specific line
  const toggleCheckbox = (lineIndex: number) => {
    const lines = content.split("\n");
    const line = lines[lineIndex];
    
    // Toggle between [ ] and [x]
    if (line.match(/^\s*\[ \]/)) {
      lines[lineIndex] = line.replace(/\[ \]/, "[x]");
    } else if (line.match(/^\s*\[x\]/i)) {
      lines[lineIndex] = line.replace(/\[x\]/i, "[ ]");
    }
    
    setContent(lines.join("\n"));
  };

  // Handle content Enter key - smart list continuation
  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const textarea = contentRef.current;
      if (!textarea) return;
      
      const cursorPos = textarea.selectionStart;
      const beforeCursor = content.slice(0, cursorPos);
      const afterCursor = content.slice(cursorPos);
      
      // Get the current line
      const lines = beforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];
      
      // Check for list patterns
      const bulletMatch = currentLine.match(/^(\s*)•\s+(.*)$/);
      const dashBulletMatch = currentLine.match(/^(\s*)-\s+(.*)$/);
      const numberMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.*)$/);
      const checklistMatch = currentLine.match(/^(\s*)\[[\sx]?\]\s*(.*)$/);
      
      // If current list item is empty, end the list
      if ((bulletMatch && !bulletMatch[2].trim()) || (dashBulletMatch && !dashBulletMatch[2].trim())) {
        e.preventDefault();
        const newLines = [...lines];
        newLines[newLines.length - 1] = "";
        const newContent = newLines.join("\n") + afterCursor;
        setContent(newContent);
        setTimeout(() => {
          const newPos = newContent.length - afterCursor.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }
      
      if (numberMatch && !numberMatch[3].trim()) {
        e.preventDefault();
        const newLines = [...lines];
        newLines[newLines.length - 1] = "";
        const newContent = newLines.join("\n") + afterCursor;
        setContent(newContent);
        setTimeout(() => {
          const newPos = newContent.length - afterCursor.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }
      
      if (checklistMatch && !checklistMatch[2].trim()) {
        e.preventDefault();
        const newLines = [...lines];
        newLines[newLines.length - 1] = "";
        const newContent = newLines.join("\n") + afterCursor;
        setContent(newContent);
        setTimeout(() => {
          const newPos = newContent.length - afterCursor.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }
      
      // Auto-continue lists
      let prefix = "";
      
      if (bulletMatch && bulletMatch[2].trim()) {
        prefix = `${bulletMatch[1]}• `;
      } else if (dashBulletMatch && dashBulletMatch[2].trim()) {
        prefix = `${dashBulletMatch[1]}• `;
      } else if (numberMatch && numberMatch[3].trim()) {
        const nextNum = parseInt(numberMatch[2]) + 1;
        prefix = `${numberMatch[1]}${nextNum}. `;
      } else if (checklistMatch && checklistMatch[2].trim()) {
        prefix = `${checklistMatch[1]}[ ] `;
      }
      
      if (prefix) {
        e.preventDefault();
        const newContent = beforeCursor + "\n" + prefix + afterCursor;
        setContent(newContent);
        
        // Set cursor after the prefix
        setTimeout(() => {
          const newPos = cursorPos + 1 + prefix.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
    }
  };

  // Insert formatting and focus textarea
  const insertFormat = (type: "bullet" | "number" | "checklist") => {
    const prefix = type === "bullet" ? "• " : type === "number" ? "1. " : "[ ] ";
    
    let newContent: string;
    if (!content.trim()) {
      newContent = prefix;
    } else {
      newContent = content + (content.endsWith("\n") ? "" : "\n") + prefix;
    }
    
    setContent(newContent);
    
    // Focus the content textarea and place cursor at end
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        const length = newContent.length;
        contentRef.current.setSelectionRange(length, length);
      }
    }, 10);
  };

  // Render content with interactive checkboxes and proper bullets
  const renderFormattedContent = () => {
    if (!content) return null;
    
    const lines = content.split("\n");
    
    return (
      <div className="space-y-1">
        {lines.map((line, index) => {
          // Check for checkbox pattern
          const uncheckedMatch = line.match(/^(\s*)\[ \]\s*(.*)$/);
          const checkedMatch = line.match(/^(\s*)\[x\]\s*(.*)$/i);
          
          // Check for bullet pattern (- or •)
          const bulletMatch = line.match(/^(\s*)[-•]\s+(.*)$/);
          
          // Check for numbered list
          const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
          
          if (uncheckedMatch) {
            const [, indent, text] = uncheckedMatch;
            return (
              <div key={index} className="flex items-start gap-2" style={{ paddingLeft: indent.length * 8 }}>
                <button
                  type="button"
                  onClick={() => toggleCheckbox(index)}
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 border-muted-foreground/50 hover:border-primary transition-colors"
                />
                <span className="text-base sm:text-lg leading-relaxed">{text}</span>
              </div>
            );
          }
          
          if (checkedMatch) {
            const [, indent, text] = checkedMatch;
            return (
              <div key={index} className="flex items-start gap-2" style={{ paddingLeft: indent.length * 8 }}>
                <button
                  type="button"
                  onClick={() => toggleCheckbox(index)}
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded bg-primary border-2 border-primary flex items-center justify-center transition-colors"
                >
                  <Check className="h-3 w-3 text-primary-foreground" />
                </button>
                <span className="text-base sm:text-lg leading-relaxed line-through text-muted-foreground">{text}</span>
              </div>
            );
          }
          
          if (bulletMatch) {
            const [, indent, text] = bulletMatch;
            return (
              <div key={index} className="flex items-start gap-2" style={{ paddingLeft: indent.length * 8 }}>
                <span className="text-base sm:text-lg leading-relaxed text-muted-foreground">•</span>
                <span className="text-base sm:text-lg leading-relaxed">{text}</span>
              </div>
            );
          }
          
          if (numberMatch) {
            const [, indent, num, text] = numberMatch;
            return (
              <div key={index} className="flex items-start gap-2" style={{ paddingLeft: indent.length * 8 }}>
                <span className="text-base sm:text-lg leading-relaxed text-muted-foreground min-w-[1.5rem]">{num}.</span>
                <span className="text-base sm:text-lg leading-relaxed">{text}</span>
              </div>
            );
          }
          
          // Plain text line
          return (
            <div key={index} className="text-base sm:text-lg leading-relaxed min-h-[1.75rem]">
              {line || "\u00A0"}
            </div>
          );
        })}
      </div>
    );
  };

  // Check if content has any formatted elements (checkboxes, bullets, numbers)
  const hasFormattedContent = content && /^(\s*)([-•]|\d+\.|\[[\sx]?\])\s/m.test(content);

  return (
    <>
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DrawerContent className="h-[95vh] max-h-[95vh]">
          <DrawerHeader className="border-b border-border/50 px-3 sm:px-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="gap-1 -ml-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              
              <DrawerTitle className="sr-only">
                {title || "New Note"}
              </DrawerTitle>
              
              <div className="flex items-center gap-1">
                {/* Save state indicator - stable, no blinking */}
                <div className="mr-2 min-w-[60px] text-right">
                  {saveState === "saving" && (
                    <span className="text-xs text-muted-foreground">
                      Saving...
                    </span>
                  )}
                  {saveState === "saved" && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end transition-opacity duration-200">
                      <Check className="h-3 w-3 text-green-500" />
                      Saved
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePin}
                  className={cn(
                    "h-8 w-8",
                    isPinned && "text-primary"
                  )}
                >
                  <Pin className={cn("h-4 w-4", isPinned && "fill-current")} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col">
            {/* Formatting Toolbar */}
            <div className="flex gap-1 px-4 py-2 border-b border-border/50 bg-accent/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat("bullet")}
                className="h-8 w-8 p-0"
                title="Bullet list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat("number")}
                className="h-8 w-8 p-0"
                title="Numbered list"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormat("checklist")}
                className="h-8 w-8 p-0"
                title="Checklist"
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-4">
              {/* Title - single line, Enter moves to body */}
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                placeholder="Title"
                className="w-full text-2xl sm:text-3xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
              />
              
              {/* Rich formatted view with interactive checkboxes */}
              {hasFormattedContent ? (
                <div className="space-y-4">
                  {/* Rendered formatted content with clickable checkboxes */}
                  {renderFormattedContent()}
                  
                  {/* Hidden textarea for editing - shown on focus of formatted area */}
                  <div className="pt-4 border-t border-border/30">
                    <textarea
                      ref={contentRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onKeyDown={handleContentKeyDown}
                      placeholder="Continue typing..."
                      className="w-full min-h-[20vh] text-base sm:text-lg bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                /* Plain textarea for simple content */
                <textarea
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleContentKeyDown}
                  placeholder="Start typing..."
                  className="w-full min-h-[50vh] text-base sm:text-lg bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed"
                />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title || "this note"}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
