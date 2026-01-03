import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pin, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { TripNote, getNotesByTripId, deleteNote, togglePinNote, createNewNote, saveNote } from "@/lib/tripNotes";
import { NoteEditor } from "./NoteEditor";
import { useToast } from "@/hooks/use-toast";

interface TripNotesProps {
  tripId: string;
}

export function TripNotes({ tripId }: TripNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<TripNote | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<TripNote | null>(null);
  const { toast } = useToast();

  // Load notes
  const loadNotes = useCallback(() => {
    setNotes(getNotesByTripId(tripId));
  }, [tripId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  const handleNewNote = () => {
    const newNote = createNewNote(tripId);
    saveNote(newNote);
    setSelectedNote(newNote);
    setEditorOpen(true);
  };

  const handleOpenNote = (note: TripNote) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = (updatedNote: TripNote) => {
    loadNotes();
  };

  const handleDeleteNote = (id: string) => {
    loadNotes();
    toast({
      title: "Note deleted",
      description: "The note has been removed.",
    });
  };

  const handleTogglePin = (id: string) => {
    const updated = togglePinNote(id);
    loadNotes();
    if (updated) {
      toast({
        title: updated.pinned ? "Note pinned" : "Note unpinned",
      });
    }
  };

  const handleDeleteFromCard = (note: TripNote, e: Event) => {
    e.stopPropagation();
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      loadNotes();
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
      setNoteToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const formatRelativeDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <div className="px-3 sm:px-4 py-3 sm:py-4 pb-8 space-y-4 sm:space-y-6">
        {/* Search & Add */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl bg-secondary border-0 h-9 sm:h-10"
            />
          </div>
          <Button onClick={handleNewNote} className="rounded-xl text-sm sm:text-base shrink-0">
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Note</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/80 flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No notes yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first note to get started
            </p>
            <Button onClick={handleNewNote} variant="outline" className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </div>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
              <Pin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Pinned
            </h3>
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleOpenNote(note)}
                onPin={(e) => {
                  e.stopPropagation();
                  handleTogglePin(note.id);
                }}
                onDelete={(e) => handleDeleteFromCard(note, e)}
                formatDate={formatRelativeDate}
              />
            ))}
          </div>
        )}

        {/* Other Notes */}
        {otherNotes.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            {pinnedNotes.length > 0 && (
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">All Notes</h3>
            )}
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleOpenNote(note)}
                onPin={(e) => {
                  e.stopPropagation();
                  handleTogglePin(note.id);
                }}
                onDelete={(e) => handleDeleteFromCard(note, e)}
                formatDate={formatRelativeDate}
              />
            ))}
          </div>
        )}

        {/* Search No Results */}
        {notes.length > 0 && filteredNotes.length === 0 && (
          <div className="text-center py-10 sm:py-12">
            <p className="text-muted-foreground text-sm sm:text-base">No notes found</p>
          </div>
        )}
      </div>

      {/* Note Editor */}
      <NoteEditor
        note={selectedNote}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedNote(null);
          loadNotes();
        }}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        onTogglePin={handleTogglePin}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{noteToDelete?.title || "this note"}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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

interface NoteCardProps {
  note: TripNote;
  onClick: () => void;
  onPin: (e: Event) => void;
  onDelete: (e: Event) => void;
  formatDate: (timestamp: number) => string;
}

function NoteCard({ note, onClick, onPin, onDelete, formatDate }: NoteCardProps) {
  // Get content preview (strip checklist markers)
  const contentPreview = note.content
    .replace(/\[[\sx]\]/gi, "")
    .replace(/^-\s*/gm, "")
    .trim();

  return (
    <Card
      className="p-3 sm:p-4 border-border/50 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.99] hover:shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h4 className="font-semibold text-foreground truncate text-sm sm:text-base">
              {note.title || "Untitled"}
            </h4>
            {note.pinned && (
              <Pin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary fill-primary shrink-0" />
            )}
          </div>
          {contentPreview && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">
              {contentPreview}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1.5 sm:mt-2">
            {formatDate(note.updatedAt)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
              <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onSelect={(e) => onPin(e)}>
              {note.pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => onDelete(e)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
