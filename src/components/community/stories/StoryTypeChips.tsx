import { StoryType, storyTypeLabels } from "@/data/communityMockData";
import { useCommunity } from "@/contexts/CommunityContext";
import { cn } from "@/lib/utils";

const storyTypes: (StoryType | "all")[] = [
  "all",
  "lessons-learned",
  "budget-breakdown",
  "first-time-diy",
  "solo-to-group",
  "mistakes-wins",
];

export function StoryTypeChips() {
  const { filters, setStoryTypeFilter } = useCommunity();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-4">
      {storyTypes.map((type) => (
        <button
          key={type}
          onClick={() => setStoryTypeFilter(type)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            filters.storyType === type
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {type === "all" ? "All Stories" : storyTypeLabels[type]}
        </button>
      ))}
    </div>
  );
}
