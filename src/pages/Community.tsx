import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommunityProvider, useCommunity } from "@/contexts/CommunityContext";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { StoriesFeed } from "@/components/community/stories/StoriesFeed";
import { DiscussionsFeed } from "@/components/community/discussions/DiscussionsFeed";
import { AskQuestionDrawer } from "@/components/community/discussions/AskQuestionDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/seo/SEOHead";

function CommunityContent() {
  const [searchParams] = useSearchParams();
  const { mode, setMode } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);

  // Set mode based on URL query param or auth state (only on mount)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "stories" || tabParam === "discussions") {
      setMode(tabParam);
    } else {
      setMode(isAuthenticated ? "discussions" : "stories");
    }
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
