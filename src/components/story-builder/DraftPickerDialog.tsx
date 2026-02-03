import { formatDistanceToNow } from "date-fns";
import { FileText, Plus, Trash2, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StoryDraft } from "@/hooks/useStoryDrafts";
import { cn } from "@/lib/utils";

interface DraftPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drafts: StoryDraft[];
  onSelectDraft: (draftId: string) => void;
  onStartFresh: () => void;
  onDeleteDraft: (draftId: string) => void;
}

export function DraftPickerDialog({
  open,
  onOpenChange,
  drafts,
  onSelectDraft,
  onStartFresh,
  onDeleteDraft,
}: DraftPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Continue writing?</DialogTitle>
          <DialogDescription>
            You have {drafts.length} {drafts.length === 1 ? "draft" : "drafts"} saved. 
            Would you like to continue from a draft or start fresh?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Start Fresh Option */}
          <button
            onClick={onStartFresh}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed",
              "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5",
              "transition-colors text-left group"
            )}
          >
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">Start a new story</p>
              <p className="text-sm text-muted-foreground">Begin with a blank canvas</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue from</span>
            </div>
          </div>

          {/* Drafts List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border border-border",
                  "hover:border-primary/50 hover:bg-secondary/50 transition-colors group"
                )}
              >
                <button
                  onClick={() => onSelectDraft(draft.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  {draft.coverImage ? (
                    <img
                      src={draft.coverImage}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {draft.title || "Untitled Story"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {draft.country && `${draft.country} · `}
                      Last edited {formatDistanceToNow(new Date(draft.lastSaved), { addSuffix: true })}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDraft(draft.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                  aria-label="Delete draft"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
