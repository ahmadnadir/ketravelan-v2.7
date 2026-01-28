import { useState, useEffect } from "react";
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

  // Set default mode based on auth state (only on mount)
  useEffect(() => {
    setMode(isAuthenticated ? "discussions" : "stories");
  }, []);

  return (
    <>
      <SEOHead
        title="Community | Ketravelan"
        description="Join the Ketravelan community. Read travel stories, ask questions, and connect with fellow DIY travelers."
      />
      <CommunityHeader />
      <div className="w-full max-w-5xl mx-auto sm:px-4 -mx-4 sm:mx-auto">
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
