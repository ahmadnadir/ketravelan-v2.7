import { useState } from "react";
import { useCommunity } from "@/contexts/CommunityContext";
import { StoryCard } from "./StoryCard";
import { StoryTypeChips } from "./StoryTypeChips";
import { CreateStoryModal } from "./CreateStoryModal";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function StoriesFeed() {
  const { filteredStories } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Filter chips */}
      <div className="py-3 border-b border-border/50">
        <StoryTypeChips />
      </div>

      {/* Stories grid */}
      <div className="p-4 space-y-4">
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

      {/* Floating CTA for authenticated users */}
      {isAuthenticated && (
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="fixed bottom-above-nav right-4 rounded-full shadow-lg gap-2"
          size="lg"
        >
          <PenSquare className="h-5 w-5" />
          Share Your Story
        </Button>
      )}

      {/* Create Story Modal */}
      <CreateStoryModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
