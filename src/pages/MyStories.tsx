import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { StoryCard } from "@/components/community/stories/StoryCard";
import { useCommunity } from "@/contexts/CommunityContext";
import { useStoryDraft } from "@/hooks/useStoryDraft";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PenLine, FileEdit, Heart, Bookmark, Plus, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MyStories() {
  const navigate = useNavigate();
  const isLoading = useSimulatedLoading(500);
  const [tab, setTab] = useState("published");
  const { stories } = useCommunity();
  const { draft, hasDraft } = useStoryDraft();

  // Filter stories based on tab
  const { publishedStories, likedStories, savedStories } = useMemo(() => {
    // In a real app, this would filter by actual user ID
    const published = stories.filter(s => s.author.id === "current-user" || s.author.name === "Ahmad Razak");
    const liked = stories.filter(s => s.isLiked);
    const saved = stories.filter(s => s.isSaved);

    return { publishedStories: published, likedStories: liked, savedStories: saved };
  }, [stories]);

  const getEmptyState = () => {
    switch (tab) {
      case "published":
        return {
          icon: <PenLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />,
          message: "No published stories yet. Share your first travel story!",
          cta: (
            <Button onClick={() => navigate("/create-story")} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Write a Story
            </Button>
          ),
        };
      case "drafts":
        return {
          icon: <FileEdit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />,
          message: "No drafts. Start writing a new story!",
          cta: (
            <Button onClick={() => navigate("/create-story")} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Start Writing
            </Button>
          ),
        };
      case "liked":
        return {
          icon: <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />,
          message: "No liked stories yet. Explore the community!",
          cta: (
            <Button onClick={() => navigate("/community?tab=stories")} variant="outline" className="mt-4">
              Explore Stories
            </Button>
          ),
        };
      case "saved":
        return {
          icon: <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />,
          message: "No saved stories. Bookmark stories to read later!",
          cta: (
            <Button onClick={() => navigate("/community?tab=stories")} variant="outline" className="mt-4">
              Explore Stories
            </Button>
          ),
        };
      default:
        return { icon: null, message: "No items found", cta: null };
    }
  };

  const renderDraftCard = () => {
    if (!hasDraft || !draft.title) return null;

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex gap-4 p-4">
          {/* Cover Image */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {draft.coverImage ? (
              <img
                src={draft.coverImage}
                alt={draft.title || "Draft"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileEdit className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Draft
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">
              {draft.title || "Untitled Story"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              <span>Last saved {formatDistanceToNow(new Date(draft.lastSaved), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="px-4 pb-4">
          <Button
            onClick={() => navigate("/create-story")}
            variant="outline"
            className="w-full"
          >
            Continue Editing
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (tab) {
      case "published":
        if (publishedStories.length === 0) {
          const empty = getEmptyState();
          return (
            <div className="text-center py-12">
              {empty.icon}
              <p className="text-muted-foreground">{empty.message}</p>
              {empty.cta}
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {publishedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        );

      case "drafts":
        const draftCard = renderDraftCard();
        if (!draftCard) {
          const empty = getEmptyState();
          return (
            <div className="text-center py-12">
              {empty.icon}
              <p className="text-muted-foreground">{empty.message}</p>
              {empty.cta}
            </div>
          );
        }
        return <div className="space-y-4">{draftCard}</div>;

      case "liked":
        if (likedStories.length === 0) {
          const empty = getEmptyState();
          return (
            <div className="text-center py-12">
              {empty.icon}
              <p className="text-muted-foreground">{empty.message}</p>
              {empty.cta}
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {likedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        );

      case "saved":
        if (savedStories.length === 0) {
          const empty = getEmptyState();
          return (
            <div className="text-center py-12">
              {empty.icon}
              <p className="text-muted-foreground">{empty.message}</p>
              {empty.cta}
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {savedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="py-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Stories & Discussions</h1>

        <SegmentedControl
          options={[
            { label: "Published", value: "published", count: publishedStories.length },
            { label: "Drafts", value: "drafts", count: hasDraft && draft.title ? 1 : 0 },
            { label: "Liked", value: "liked", count: likedStories.length },
            { label: "Saved", value: "saved", count: savedStories.length },
          ]}
          value={tab}
          onChange={setTab}
        />

        {renderContent()}
      </div>
    </AppLayout>
  );
}
