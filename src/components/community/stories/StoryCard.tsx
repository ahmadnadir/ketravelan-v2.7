import { Heart, Bookmark, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Story, storyTypeLabels } from "@/data/communityMockData";
import { useCommunity } from "@/contexts/CommunityContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const { toggleStoryLike, toggleStorySave } = useCommunity();

  return (
    <article className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 transition-shadow hover:shadow-md">
      {/* Cover Image */}
      <Link to={`/community/stories/${story.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-xs"
          >
            {storyTypeLabels[story.storyType]}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link to={`/community/stories/${story.slug}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
            {story.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {story.excerpt}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {story.location.flag} {story.location.city || story.location.country}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {story.readingTime} min read
          </span>
        </div>

        {/* Author and actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <Link
            to={`/user/${story.author.id}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={story.author.avatar} alt={story.author.name} />
              <AvatarFallback>{story.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {story.author.name}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleStoryLike(story.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors",
                story.isLiked
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart
                className={cn("h-4 w-4", story.isLiked && "fill-current")}
              />
              <span className="text-xs">{story.likes}</span>
            </button>
            <button
              onClick={() => toggleStorySave(story.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors",
                story.isSaved
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark
                className={cn("h-4 w-4", story.isSaved && "fill-current")}
              />
              <span className="text-xs">{story.saves}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
