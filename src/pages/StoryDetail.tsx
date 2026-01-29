import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Share2, MapPin, Clock, Send } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CommunityProvider, useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { storyTypeLabels } from "@/data/communityMockData";
import { SEOHead } from "@/components/seo/SEOHead";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Mock comments data
const mockComments = [
  {
    id: "1",
    author: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=sarah" },
    content: "This is such an inspiring story! I've been wanting to visit Langkawi for years. Thanks for sharing your experience!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "2",
    author: { name: "Marcus Wong", avatar: "https://i.pravatar.cc/150?u=marcus" },
    content: "Great tips about the local food spots. Adding this to my travel list!",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "3",
    author: { name: "Aisha Rahman", avatar: "https://i.pravatar.cc/150?u=aisha" },
    content: "The photos are stunning! How long did you stay there?",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
];

function StoryDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { stories, toggleStoryLike, toggleStorySave } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);

  const story = stories.find((s) => s.slug === slug);

  const handleShare = async () => {
    const shareData = {
      title: story?.title || "Check out this story",
      text: story?.excerpt || "",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      author: { name: "You", avatar: "https://i.pravatar.cc/150?u=you" },
      content: commentText.trim(),
      createdAt: new Date(),
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
    toast.success("Comment posted!");
  };

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-xl font-semibold mb-2">Story not found</h1>
        <p className="text-muted-foreground mb-4">This story may have been removed or the link is incorrect.</p>
        <Link to="/community">
          <Button>Back to Community</Button>
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(story.createdAt, { addSuffix: true });

  return (
    <>
      <SEOHead
        title={`${story.title} | Ketravelan Stories`}
        description={story.excerpt}
        ogImage={story.coverImage}
      />

      {/* Hero image with overlay header */}
      <div className="relative -mx-4 sm:-mx-6 -mt-4">
        <div className="aspect-[16/10] sm:aspect-[21/9]">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>

        {/* Back button */}
        <Link
          to="/community"
          className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Share button */}
        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <Badge className="mb-3 bg-white/20 backdrop-blur-sm text-white border-0">
            {storyTypeLabels[story.storyType]}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {story.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="py-4 sm:py-6 max-w-3xl mx-auto">
        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {story.location.flag} {story.location.city || story.location.country}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {story.readingTime} min read
          </span>
          <span>{timeAgo}</span>
        </div>

        {/* Author */}
        <Link
          to={`/user/${story.author.id}`}
          className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={story.author.avatar} alt={story.author.name} />
            <AvatarFallback>{story.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{story.author.name}</p>
            <p className="text-sm text-muted-foreground">Travel enthusiast</p>
          </div>
        </Link>

        {/* Story content */}
        <article className="prose prose-sm sm:prose max-w-none mb-8">
          <p className="text-lg text-foreground leading-relaxed">{story.excerpt}</p>
          <p className="text-muted-foreground">
            {story.content || "Full story content would appear here. This is placeholder text for the demo. The actual story would contain rich text, images, and personal experiences from the traveler."}
          </p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </article>

        {/* Actions */}
        <div className="flex items-center justify-between py-4 border-t border-b border-border mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleStoryLike(story.id)}
              className={`flex items-center gap-2 transition-colors ${
                story.isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-5 w-5 ${story.isLiked ? "fill-current" : ""}`} />
              <span>{story.likes}</span>
            </button>
            <button 
              onClick={() => toggleStorySave(story.id)}
              className={`flex items-center gap-2 transition-colors ${
                story.isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className={`h-5 w-5 ${story.isSaved ? "fill-current" : ""}`} />
              <span>{story.saves}</span>
            </button>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
          
          {/* Comment Input */}
          {isAuthenticated ? (
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="bg-secondary/50 rounded-lg p-3 mb-6 text-center">
              <p className="text-sm text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function StoryDetail() {
  return (
    <CommunityProvider>
      <AppLayout>
        <StoryDetailContent />
      </AppLayout>
    </CommunityProvider>
  );
}
