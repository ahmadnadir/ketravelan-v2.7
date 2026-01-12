import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Share2, MapPin, Clock, MessageCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockStories, storyTypeLabels } from "@/data/communityMockData";
import { SEOHead } from "@/components/seo/SEOHead";
import { formatDistanceToNow } from "date-fns";

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const story = mockStories.find((s) => s.slug === slug);

  if (!story) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <h1 className="text-xl font-semibold mb-2">Story not found</h1>
          <p className="text-muted-foreground mb-4">This story may have been removed or the link is incorrect.</p>
          <Link to="/community">
            <Button>Back to Community</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const timeAgo = formatDistanceToNow(story.createdAt, { addSuffix: true });

  return (
    <AppLayout hideHeader>
      <SEOHead
        title={`${story.title} | Ketravelan Stories`}
        description={story.excerpt}
        ogImage={story.coverImage}
      />

      {/* Hero image with overlay header */}
      <div className="relative">
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
        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors">
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
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
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
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="h-5 w-5" />
              <span>{story.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bookmark className="h-5 w-5" />
              <span>{story.saves}</span>
            </button>
          </div>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Discuss CTA */}
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h3 className="font-semibold mb-1">Have questions about this story?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Start a discussion and get answers from the community.
          </p>
          <Button variant="outline">Discuss This Story</Button>
        </div>
      </div>
    </AppLayout>
  );
}
