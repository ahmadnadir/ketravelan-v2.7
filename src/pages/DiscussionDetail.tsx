import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockDiscussions, discussionTopicLabels } from "@/data/communityMockData";
import { SEOHead } from "@/components/seo/SEOHead";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Mock replies for demo
const mockReplies = [
  {
    id: "reply-1",
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
    content: "I'd recommend flying if you arrive late. AirAsia has cheap flights to Langkawi from KLIA2. You can book a budget hotel near the airport for the night.",
    createdAt: new Date("2025-01-10T10:00:00"),
    isAccepted: true,
  },
  {
    id: "reply-2",
    author: { name: "Ahmad R", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
    content: "Bus to Kuala Perlis then ferry is the scenic route but takes about 6-7 hours total. Only worth it if you enjoy the journey!",
    createdAt: new Date("2025-01-10T11:30:00"),
    isAccepted: false,
  },
];

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [replyText, setReplyText] = useState("");
  
  const discussion = mockDiscussions.find((d) => d.id === id);

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
    <AppLayout hideHeader>
      <SEOHead
        title={`${discussion.title} | Ketravelan Discussions`}
        description={discussion.details || discussion.title}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/community"
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

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {discussion.location.flag} {discussion.location.city || discussion.location.country}
            </Badge>
            <Badge variant="outline">
              {discussionTopicLabels[discussion.topic]}
            </Badge>
            {discussion.isAnswered && (
              <Badge variant="outline" className="text-[hsl(var(--success))] border-[hsl(var(--success))] gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Answered
              </Badge>
            )}
          </div>
        </div>

        {/* Replies */}
        <div className="p-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-4">
            {mockReplies.length} {mockReplies.length === 1 ? "Reply" : "Replies"}
          </h3>

          <div className="space-y-4">
            {mockReplies.map((reply) => (
              <div
                key={reply.id}
                className={`p-4 rounded-xl ${
                  reply.isAccepted
                    ? "bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30"
                    : "bg-secondary/50"
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author.avatar} />
                    <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{reply.author.name}</p>
                      {reply.isAccepted && (
                        <Badge variant="outline" className="text-[hsl(var(--success))] border-[hsl(var(--success))] text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Accepted
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground">{reply.content}</p>
              </div>
            ))}
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
