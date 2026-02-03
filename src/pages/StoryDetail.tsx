import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Share2, MapPin, Clock, Send, Pencil } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCommunity } from "@/contexts/CommunityContext";
import { useAuth } from "@/contexts/AuthContext";
import { storyTypeLabels, blockTypeConfig } from "@/data/communityMockData";
import { SEOHead } from "@/components/seo/SEOHead";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Mock comments for stories that don't have real comments yet
const defaultMockComments = [
  {
    id: "mock-1",
    storyId: "",
    author: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=sarah" },
    content: "This is such an inspiring story! I've been wanting to visit this place for years. Thanks for sharing your experience!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mock-2",
    storyId: "",
    author: { name: "Marcus Wong", avatar: "https://i.pravatar.cc/150?u=marcus" },
    content: "Great tips about the local food spots. Adding this to my travel list!",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

function StoryDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { stories, toggleStoryLike, toggleStorySave, addComment, getCommentsForStory } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");

  const story = stories.find((s) => s.slug === slug);
  
  // Check if current user is the author (for demo, author.id === "current-user")
  const isAuthor = story?.author.id === "current-user";

  // Get real comments for this story + add mock comments for older stories
  const storyComments = useMemo(() => {
    if (!story) return [];
    const realComments = getCommentsForStory(story.id);
    // Only show mock comments for mock stories (those without real comments)
    if (realComments.length === 0 && story.id.startsWith("story-") && !story.id.includes(Date.now().toString(36).slice(0, 4))) {
      return defaultMockComments.map((c) => ({ ...c, storyId: story.id }));
    }
    return realComments;
  }, [story, getCommentsForStory]);

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
    if (!commentText.trim() || !story) return;
    addComment(story.id, commentText.trim());
    setCommentText("");
    toast.success("Comment posted!");
  };

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-xl font-semibold mb-2">Story not found</h1>
        <p className="text-muted-foreground mb-4">This story may have been removed or the link is incorrect.</p>
        <Link to="/community?tab=stories">
          <Button>Back to Community</Button>
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(story.createdAt, { addSuffix: true });

  // Render story blocks for user-created stories
  const renderBlocks = () => {
    // If we have blocks, render them
    if (story.blocks && story.blocks.length > 0) {
      return story.blocks.map((block) => {
        switch (block.type) {
          case "text":
          case "moment":
          case "lesson":
          case "tip":
            return (
              <div key={block.id} className="mb-4">
                {block.type !== "text" && (
                  <span className="text-sm font-medium text-primary mb-1 block">
                    {blockTypeConfig[block.type]?.icon} {blockTypeConfig[block.type]?.label}
                  </span>
                )}
                <p className="text-foreground whitespace-pre-wrap">{block.content}</p>
              </div>
            );
          case "image":
            return (
              <figure key={block.id} className="my-6">
                <img
                  src={block.imageUrl}
                  alt={block.caption || "Story image"}
                  className="w-full rounded-lg"
                />
                {block.caption && (
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "location":
            return (
              <div key={block.id} className="my-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{block.locationName}</span>
                </div>
                {block.content && (
                  <p className="text-muted-foreground text-sm">{block.content}</p>
                )}
              </div>
            );
          default:
            return null;
        }
      });
    }
    
    // No blocks - show content if it's different from excerpt (avoid duplication)
    if (story.content && story.content !== story.excerpt) {
      return (
        <p className="text-muted-foreground whitespace-pre-wrap">
          {story.content}
        </p>
      );
    }
    
    // No additional content to show
    return null;
  };

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
          to="/community?tab=stories"
          className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isAuthor && (
            <button 
              onClick={() => navigate(`/create-story?edit=${story.id}`)}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

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
          {/* For stories with blocks, show excerpt as intro then blocks */}
          {story.blocks && story.blocks.length > 0 ? (
            <>
              <p className="text-lg text-foreground leading-relaxed">{story.excerpt}</p>
              {renderBlocks()}
            </>
          ) : (
            /* For content-based stories, show full content (not excerpt) */
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
              {story.content || story.excerpt}
            </p>
          )}
          
          {/* Inline Media (images/galleries) */}
          {story.inlineMedia && story.inlineMedia.length > 0 && (
            <div className="space-y-6 mt-6">
              {story.inlineMedia.map((media) => (
                <div key={media.id}>
                  {media.type === "image" && media.images[0] && (
                    <figure className="my-6">
                      <img
                        src={media.images[0].url}
                        alt={media.images[0].caption || "Story image"}
                        className="w-full rounded-lg"
                      />
                      {media.images[0].caption && (
                        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                          {media.images[0].caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  {media.type === "gallery" && media.images.length > 0 && (
                    <div className="my-6">
                      <div className="grid grid-cols-2 gap-2">
                        {media.images.map((img, index) => (
                          <figure key={index} className="relative">
                            <img
                              src={img.url}
                              alt={img.caption || `Gallery image ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            {img.caption && (
                              <figcaption className="text-xs text-muted-foreground mt-1 text-center truncate">
                                {img.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </article>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

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
          <h3 className="font-semibold text-lg">Comments ({storyComments.length})</h3>
          
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
            {storyComments.map((comment) => (
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
    <AppLayout>
      <StoryDetailContent />
    </AppLayout>
  );
}
