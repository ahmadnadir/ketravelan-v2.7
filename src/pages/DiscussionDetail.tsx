import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, Send, ChevronUp, ChevronDown, Eye, CornerDownRight, Share2, Flag } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockDiscussions, discussionTopicLabels } from "@/data/communityMockData";
import { SEOHead } from "@/components/seo/SEOHead";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

const mockReplies = [
  {
    id: "reply-1",
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
    content: "I'd recommend flying if you arrive late. AirAsia has cheap flights to Langkawi from KLIA2. You can book a budget hotel near the airport for the night.",
    createdAt: new Date("2025-01-10T10:00:00"),
    score: 12,
  },
  {
    id: "reply-2",
    author: { name: "Ahmad R", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
    content: "Bus to Kuala Perlis then ferry is the scenic route but takes about 6-7 hours total. Only worth it if you enjoy the journey!",
    createdAt: new Date("2025-01-10T11:30:00"),
    score: 5,
  },
];

const sortOptions = [
  { label: "Top", value: "top" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [sortBy, setSortBy] = useState("top");
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(mockReplies.map((r) => [r.id, r.score]))
  );

  const discussion = mockDiscussions.find((d) => d.id === id);

  const handleVote = (replyId: string, direction: "up" | "down") => {
    const current = votes[replyId] ?? null;
    setVotes((prev) => ({
      ...prev,
      [replyId]: current === direction ? null : direction,
    }));
    setScores((prev) => {
      const base = mockReplies.find((r) => r.id === replyId)?.score ?? 0;
      let delta = 0;
      const newVote = current === direction ? null : direction;
      if (newVote === "up") delta = 1;
      else if (newVote === "down") delta = -1;
      return { ...prev, [replyId]: base + delta };
    });
  };

  const sortedReplies = useMemo(() => {
    const list = [...mockReplies];
    switch (sortBy) {
      case "top":
        return list.sort((a, b) => (scores[b.id] ?? b.score) - (scores[a.id] ?? a.score));
      case "newest":
        return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case "oldest":
        return list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      default:
        return list;
    }
  }, [sortBy, scores]);

  if (!discussion) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <h1 className="text-xl font-semibold mb-2">Discussion not found</h1>
          <p className="text-muted-foreground mb-4">This discussion may have been removed.</p>
          <Link to="/community">
            <Button>Back to Community</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const timeAgo = formatDistanceToNow(discussion.createdAt, { addSuffix: true });

  return (
    <AppLayout>
      <SEOHead
        title={`${discussion.title} | Ketravelan Discussions`}
        description={discussion.details || discussion.title}
      />

      {/* Sub-header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 -mx-4 -mt-4 mb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/community?tab=discussions"
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold truncate">Discussion</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Question */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-10 w-10">
              {discussion.isAnonymous ? (
                <AvatarFallback className="bg-muted">?</AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={discussion.author.avatar} />
                  <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                </>
              )}
            </Avatar>
            <div>
              <p className="font-medium">
                {discussion.isAnonymous ? "Anonymous" : discussion.author.name}
              </p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-2">{discussion.title}</h2>

          {discussion.details && (
            <p className="text-muted-foreground mb-4">{discussion.details}</p>
          )}

          {/* Tags + stats */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {discussion.location.flag} {discussion.location.city || discussion.location.country}
            </Badge>
            <Badge variant="outline">
              {discussionTopicLabels[discussion.topic]}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {mockReplies.length} {mockReplies.length === 1 ? "reply" : "replies"}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              1.2k views
            </span>
          </div>
        </div>

        {/* Replies */}
        <div className="p-4 pb-24">
          {/* Sort control */}
          <div className="mb-4">
            <SegmentedControl
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="max-w-[240px]"
            />
          </div>

          <div className="space-y-3">
            {sortedReplies.map((reply) => {
              const userVote = votes[reply.id] ?? null;
              return (
                <div
                  key={reply.id}
                  className="flex gap-2 p-3 rounded-xl bg-secondary/50"
                >
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-0.5 pt-1">
                    <button
                      onClick={() => handleVote(reply.id, "up")}
                      className={`p-0.5 rounded transition-colors ${
                        userVote === "up"
                          ? "text-foreground"
                          : "text-muted-foreground/50 hover:text-muted-foreground"
                      }`}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <span className={`text-xs font-semibold tabular-nums ${
                      userVote ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {scores[reply.id] ?? reply.score}
                    </span>
                    <button
                      onClick={() => handleVote(reply.id, "down")}
                      className={`p-0.5 rounded transition-colors ${
                        userVote === "down"
                          ? "text-foreground"
                          : "text-muted-foreground/50 hover:text-muted-foreground"
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Reply content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={reply.author.avatar} />
                        <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{reply.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{reply.content}</p>
                    {/* Action row */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <CornerDownRight className="h-3 w-3" />
                        Reply
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Share2 className="h-3 w-3" />
                        Share
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Flag className="h-3 w-3" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reply input */}
      {isAuthenticated && (
        <div className="sticky bottom-0 p-4 bg-background border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" disabled={!replyText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
