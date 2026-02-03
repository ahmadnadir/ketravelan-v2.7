import { formatDistanceToNow } from "date-fns";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraftBannerProps {
  lastSaved: Date;
  onResume: () => void;
  onStartFresh: () => void;
}

export function DraftBanner({ lastSaved, onResume, onStartFresh }: DraftBannerProps) {
  const timeAgo = formatDistanceToNow(lastSaved, { addSuffix: true });

  return (
    <div className="mx-4 mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
          <Pencil className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">
            You were writing a story recently. Want to continue?
          </p>
          <p className="text-sm text-muted-foreground">Last saved {timeAgo}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={onResume}>
              Continue writing
            </Button>
            <Button size="sm" variant="ghost" onClick={onStartFresh}>
              Start fresh
            </Button>
          </div>
        </div>
        <button
          onClick={onStartFresh}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
