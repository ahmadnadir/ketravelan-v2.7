import { useState } from "react";
import { Plus, Search, Pin, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockNotes } from "@/data/mockData";

export function TripNotes() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = mockNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <div className="px-4 py-4 pb-8 space-y-6">
      {/* Search & Add */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-secondary border-0"
          />
        </div>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Pin className="h-3.5 w-3.5" />
            Pinned
          </h3>
          {pinnedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Other Notes */}
      {otherNotes.length > 0 && (
        <div className="space-y-3">
          {pinnedNotes.length > 0 && (
            <h3 className="text-sm font-medium text-muted-foreground">All Notes</h3>
          )}
          {otherNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notes found</p>
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    date: string;
    pinned: boolean;
  };
}

function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="p-4 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground truncate">{note.title}</h4>
            {note.pinned && <Pin className="h-3.5 w-3.5 text-primary shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 whitespace-pre-line">
            {note.content}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{note.date}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{note.pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
