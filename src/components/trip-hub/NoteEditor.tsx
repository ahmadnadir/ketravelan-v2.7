import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Pin, Trash2, Check, Square, CheckSquare, List, ListOrdered } from "lucide-react";
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

  // Insert formatting and focus textarea
  const insertFormat = (type: "bullet" | "number" | "checklist") => {
    const prefix = type === "bullet" ? "- " : type === "number" ? "1. " : "[ ] ";
    
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

  const toggleChecklistItem = (lineIndex: number, check: boolean) => {
    const lines = content.split("\n");
    if (check) {
      lines[lineIndex] = lines[lineIndex].replace(/\[\s*\]/, "[x]");
    } else {
      lines[lineIndex] = lines[lineIndex].replace(/\[x\]/i, "[ ]");
    }
    setContent(lines.join("\n"));
  };

  // Parse content for formatted items (bullets, numbers, checklists) - for preview only
  const renderFormattedPreview = (text: string) => {
    const lines = text.split("\n");
    
    return lines.map((line, index) => {
      // Checklist - unchecked
      const uncheckedMatch = line.match(/^(\s*)-?\s*\[\s*\]\s*(.*)$/);
      if (uncheckedMatch) {
        return (
          <div key={index} className="flex items-start gap-2 py-0.5">
            <button
              type="button"
              onClick={() => toggleChecklistItem(index, true)}
              className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Square className="h-4 w-4" />
            </button>
            <span className="flex-1">{uncheckedMatch[2]}</span>
          </div>
        );
      }
      
      // Checklist - checked
      const checkedMatch = line.match(/^(\s*)-?\s*\[x\]\s*(.*)$/i);
      if (checkedMatch) {
        return (
          <div key={index} className="flex items-start gap-2 py-0.5">
            <button
              type="button"
              onClick={() => toggleChecklistItem(index, false)}
              className="mt-0.5 text-primary"
            >
              <CheckSquare className="h-4 w-4" />
            </button>
            <span className="flex-1 line-through text-muted-foreground">{checkedMatch[2]}</span>
          </div>
        );
      }
      
      // Bullet point
      const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);
      if (bulletMatch && !line.match(/\[[\sx]?\]/i)) {
        return (
          <div key={index} className="flex items-start gap-2 py-0.5">
            <span className="text-muted-foreground mt-0.5">•</span>
            <span className="flex-1">{bulletMatch[2]}</span>
          </div>
        );
      }
      
      // Numbered list
      const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (numberMatch) {
        return (
          <div key={index} className="flex items-start gap-2 py-0.5">
            <span className="text-muted-foreground min-w-[1.5rem] text-right">{numberMatch[2]}.</span>
            <span className="flex-1">{numberMatch[3]}</span>
          </div>
        );
      }
      
      // Regular line
      return <div key={index}>{line || "\u00A0"}</div>;
    });
  };

  // Check if content has any formatting
  const hasFormatting = /(\[[\sx]?\]|^\s*-\s+|^\s*\d+\.\s+)/im.test(content);

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
                <Square className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-4">
              {/* Title */}
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-2xl sm:text-3xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
              />
              
              {/* Content - Always editable textarea */}
              {hasFormatting ? (
                <div className="space-y-4">
                  {/* Interactive formatted preview */}
                  <div className="text-base sm:text-lg leading-relaxed">
                    {renderFormattedPreview(content)}
                  </div>
                  
                  {/* Editable raw content area - tap to edit */}
                  <div className="border-t border-border/30 pt-4">
                    <p className="text-xs text-muted-foreground mb-2">Edit raw content:</p>
                    <textarea
                      ref={contentRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start typing..."
                      className="w-full min-h-[30vh] text-sm bg-muted/30 rounded-lg p-3 border-none outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed font-mono"
                    />
                  </div>
                </div>
              ) : (
                <textarea
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
