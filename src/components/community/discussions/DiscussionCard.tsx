import { MessageCircle, CheckCircle2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Discussion, discussionTopicLabels } from "@/data/communityMockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const timeAgo = formatDistanceToNow(discussion.createdAt, { addSuffix: true });

  return (
    <Link
      to={`/community/discussions/${discussion.id}`}
      className="block bg-card rounded-xl p-3 sm:p-4 border border-border/50 transition-all hover:shadow-sm hover:border-border"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
          {discussion.isAnonymous ? (
            <AvatarFallback className="bg-muted text-muted-foreground">?</AvatarFallback>
          ) : (
            <>
              <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
              <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
            </>
          )}
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with answered badge */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-medium text-foreground line-clamp-2 flex-1 text-sm sm:text-base">
              {discussion.title}
            </h3>
            {discussion.isAnswered && (
              <Badge variant="outline" className="flex-shrink-0 text-[hsl(var(--success))] border-[hsl(var(--success))] gap-1 text-[10px] sm:text-xs">
                <CheckCircle2 className="h-3 w-3" />
                <span className="hidden sm:inline">Answered</span>
                <span className="sm:hidden">✓</span>
              </Badge>
            )}
          </div>

          {/* Preview text */}
          {discussion.details && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
              {discussion.details}
            </p>
          )}

          {/* Meta row - Stack on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
            {/* Line 1: Location + Topic */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {discussion.location.flag} {discussion.location.city || discussion.location.country}
              </span>
              <Badge variant="secondary" className="text-[10px] sm:text-xs font-normal">
                {discussionTopicLabels[discussion.topic]}
              </Badge>
            </div>
            {/* Line 2: Replies + Time */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {discussion.replyCount} {discussion.replyCount === 1 ? "reply" : "replies"}
              </span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
