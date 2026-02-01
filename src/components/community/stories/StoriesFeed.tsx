import { useCommunity } from "@/contexts/CommunityContext";
import { StoryCard } from "./StoryCard";
import { StoryTypeChips } from "./StoryTypeChips";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function StoriesFeed() {
  const { filteredStories, filters, setStorySearchQuery } = useCommunity();

  return (
    <div className="flex flex-col">
      {/* Filter section - sticky with search and chips */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={filters.storySearchQuery}
            onChange={(e) => setStorySearchQuery(e.target.value)}
            className="pl-9 rounded-full w-full"
          />
        </div>
        
        {/* Story type chips */}
        <StoryTypeChips />
      </div>

      {/* Stories grid - bottom padding for CTA clearance */}
      <div className="p-4 space-y-4 pb-32">
        {filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No stories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
