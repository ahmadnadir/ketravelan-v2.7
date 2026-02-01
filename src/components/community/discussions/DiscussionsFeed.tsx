import { useCommunity } from "@/contexts/CommunityContext";
import { DiscussionCard } from "./DiscussionCard";
import { LocationFilter } from "./LocationFilter";
import { TopicFilter } from "./TopicFilter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DiscussionsFeed() {
  const { filteredDiscussions, filters, setDiscussionSearchQuery } = useCommunity();

  return (
    <div className="flex flex-col">
      {/* Filter bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 space-y-3">
        {/* Mobile: Stack vertically | Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
          <LocationFilter />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={filters.discussionSearchQuery}
              onChange={(e) => setDiscussionSearchQuery(e.target.value)}
              className="pl-9 rounded-full w-full"
            />
          </div>
        </div>

        {/* Topic chips - horizontal scroll with no overflow */}
        <TopicFilter />

        {/* Location helper text */}
        {filters.location !== "global" && (
          <p className="text-xs text-muted-foreground">
            Showing discussions in {filters.location === "Malaysia" ? "🇲🇾" : "📍"} {filters.location}
          </p>
        )}
      </div>

      {/* Discussions list - bottom padding for CTA clearance */}
      <div className="p-4 space-y-3 pb-32">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No discussions found</p>
            <p className="text-sm text-muted-foreground">
              Try changing your filters or be the first to ask!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
