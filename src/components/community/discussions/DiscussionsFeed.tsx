import { useCommunity } from "@/contexts/CommunityContext";
import { DiscussionCard } from "./DiscussionCard";
import { LocationFilter } from "./LocationFilter";
import { TopicFilter } from "./TopicFilter";
import { MessageSquarePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface DiscussionsFeedProps {
  onAskQuestion?: () => void;
}

export function DiscussionsFeed({ onAskQuestion }: DiscussionsFeedProps) {
  const { filteredDiscussions, filters, setDiscussionSearchQuery } = useCommunity();
  const { isAuthenticated } = useAuth();

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

      {/* Discussions list - extra bottom padding on mobile for sticky CTA */}
      <div className="p-4 space-y-3 pb-28 sm:pb-4">
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

      {/* Desktop floating button */}
      {isAuthenticated && onAskQuestion && (
        <Button
          onClick={onAskQuestion}
          className="hidden sm:flex fixed bottom-above-nav right-4 rounded-full shadow-lg gap-2"
          size="lg"
        >
          <MessageSquarePlus className="h-5 w-5" />
          Ask the Community
        </Button>
      )}

      {/* Mobile sticky full-width button */}
      {isAuthenticated && onAskQuestion && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 bottom-above-nav">
          <Button
            onClick={onAskQuestion}
            className="w-full gap-2"
            size="lg"
          >
            <MessageSquarePlus className="h-5 w-5" />
            Ask the Community
          </Button>
        </div>
      )}
    </div>
  );
}
