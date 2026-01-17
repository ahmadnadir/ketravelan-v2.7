import { useState } from "react";
import { useCommunity } from "@/contexts/CommunityContext";
import { StoryCard } from "./StoryCard";
import { StoryTypeChips } from "./StoryTypeChips";
import { CreateStoryModal } from "./CreateStoryModal";
import { PenSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export function StoriesFeed() {
  const { filteredStories, filters, setStorySearchQuery } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

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

      {/* Stories grid - extra bottom padding on mobile for sticky CTA */}
      <div className="p-4 space-y-4 pb-28 sm:pb-4">
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

      {/* Desktop floating CTA */}
      {isAuthenticated && (
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="hidden sm:flex fixed bottom-above-nav right-4 rounded-full shadow-lg gap-2"
          size="lg"
        >
          <PenSquare className="h-5 w-5" />
          Share Your Story
        </Button>
      )}

      {/* Mobile sticky full-width CTA */}
      {isAuthenticated && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 bottom-above-nav">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="w-full gap-2"
            size="lg"
          >
            <PenSquare className="h-5 w-5" />
            Share Your Story
          </Button>
        </div>
      )}

      {/* Create Story Modal */}
      <CreateStoryModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
