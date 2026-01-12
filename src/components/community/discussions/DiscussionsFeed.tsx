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
  const { filteredDiscussions, filters, setSearchQuery } = useCommunity();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Filter bar */}
      <div className="sticky top-[57px] z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 space-y-3">
        {/* Location + Search */}
        <div className="flex items-center gap-2">
          <LocationFilter />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </div>

        {/* Topic chips */}
        <TopicFilter />

        {/* Location helper text */}
        {filters.location !== "global" && (
          <p className="text-xs text-muted-foreground">
            Showing discussions in {filters.location === "Malaysia" ? "🇲🇾" : "📍"} {filters.location}
          </p>
        )}
      </div>

      {/* Discussions list */}
      <div className="p-4 space-y-3">
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

      {/* Floating CTA */}
      {isAuthenticated && onAskQuestion && (
        <Button
          onClick={onAskQuestion}
          className="fixed bottom-above-nav right-4 rounded-full shadow-lg gap-2"
          size="lg"
        >
          <MessageSquarePlus className="h-5 w-5" />
          Ask the Community
        </Button>
      )}
    </div>
  );
}
