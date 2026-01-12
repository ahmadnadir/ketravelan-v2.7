import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommunityProvider, useCommunity } from "@/contexts/CommunityContext";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { StoriesFeed } from "@/components/community/stories/StoriesFeed";
import { DiscussionsFeed } from "@/components/community/discussions/DiscussionsFeed";
import { AskQuestionDrawer } from "@/components/community/discussions/AskQuestionDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/seo/SEOHead";

function CommunityContent() {
  const { mode, setMode } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);
  
  // Preserve scroll positions for each mode
  const storiesScrollRef = useRef(0);
  const discussionsScrollRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set default mode based on auth state (only on mount)
  useEffect(() => {
    setMode(isAuthenticated ? "discussions" : "stories");
  }, []);

  // Save scroll position before mode change
  const handleModeChange = (newMode: "stories" | "discussions") => {
    if (scrollContainerRef.current) {
      if (mode === "stories") {
        storiesScrollRef.current = scrollContainerRef.current.scrollTop;
      } else {
        discussionsScrollRef.current = scrollContainerRef.current.scrollTop;
      }
    }
    setMode(newMode);
  };

  // Restore scroll position after mode change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const targetScroll = mode === "stories" ? storiesScrollRef.current : discussionsScrollRef.current;
      scrollContainerRef.current.scrollTop = targetScroll;
    }
  }, [mode]);

  return (
    <>
      <SEOHead
        title="Community | Ketravelan"
        description="Join the Ketravelan community. Read travel stories, ask questions, and connect with fellow DIY travelers."
      />
      <CommunityHeader />
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-container pb-20">
        {mode === "stories" ? (
          <StoriesFeed />
        ) : (
          <DiscussionsFeed onAskQuestion={() => setAskQuestionOpen(true)} />
        )}
      </div>
      <AskQuestionDrawer open={askQuestionOpen} onOpenChange={setAskQuestionOpen} />
    </>
  );
}

export default function Community() {
  return (
    <CommunityProvider>
      <AppLayout>
        <CommunityContent />
      </AppLayout>
    </CommunityProvider>
  );
}
