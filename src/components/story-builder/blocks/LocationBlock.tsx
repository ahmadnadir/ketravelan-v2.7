import { MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoryBlock, blockTypeConfig } from "@/data/communityMockData";

interface TripLocation {
  destination: string;
  country?: string;
  city?: string;
}

interface LocationBlockProps {
  block: StoryBlock;
  onUpdate: (updates: Partial<StoryBlock>) => void;
  onRemove: () => void;
  tripLocation?: TripLocation | null;
}

export function LocationBlock({ 
  block, 
  onUpdate, 
  tripLocation 
}: LocationBlockProps) {
  
  const handleUseTripLocation = () => {
    if (tripLocation) {
      onUpdate({ locationName: tripLocation.destination });
    }
  };

  return (
    <div className="space-y-4">
      {/* Trip Location Helper */}
      {tripLocation && (
        <div className="flex items-center justify-between gap-2 text-sm 
                        bg-muted/50 rounded-lg px-3 py-2">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Navigation className="h-3.5 w-3.5" />
            From your trip: {tripLocation.destination}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUseTripLocation}
            className="h-7 px-2 text-xs"
          >
            Use
          </Button>
        </div>
      )}

      {/* Location Name Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 
                           h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={block.locationName || ""}
          onChange={(e) => onUpdate({ locationName: e.target.value })}
          placeholder="Location name (e.g., Langkawi Sky Bridge)"
          className="pl-10 h-11 bg-muted/30 border-border/50 
                     focus-visible:border-primary/50 focus-visible:bg-background"
        />
      </div>

      {/* Notes Textarea */}
      <textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder={blockTypeConfig.location.placeholder}
        className="w-full min-h-[80px] px-4 py-3 text-base 
                   bg-muted/30 rounded-lg border border-border/50
                   placeholder:text-muted-foreground
                   focus:outline-none focus:border-primary/50 focus:bg-background
                   resize-y transition-colors"
      />

      {/* Helper text when no trip linked */}
      {!tripLocation && (
        <p className="text-xs text-muted-foreground">
          Tip: Link a trip to your story to auto-fill locations
        </p>
      )}
    </div>
  );
}
