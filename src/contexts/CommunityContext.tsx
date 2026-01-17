import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Story,
  Discussion,
  StoryType,
  DiscussionTopic,
  mockStories,
  mockDiscussions,
} from "@/data/communityMockData";

type CommunityMode = "stories" | "discussions";

interface CommunityFilters {
  storyType: StoryType | "all";
  discussionTopic: DiscussionTopic | "all";
  location: string | "global";
  storySearchQuery: string;
  discussionSearchQuery: string;
}

interface CommunityContextType {
  mode: CommunityMode;
  setMode: (mode: CommunityMode) => void;
  stories: Story[];
  discussions: Discussion[];
  filters: CommunityFilters;
  setStoryTypeFilter: (type: StoryType | "all") => void;
  setDiscussionTopicFilter: (topic: DiscussionTopic | "all") => void;
  setLocationFilter: (location: string | "global") => void;
  setStorySearchQuery: (query: string) => void;
  setDiscussionSearchQuery: (query: string) => void;
  toggleStoryLike: (storyId: string) => void;
  toggleStorySave: (storyId: string) => void;
  filteredStories: Story[];
  filteredDiscussions: Discussion[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CommunityMode>("stories");
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [discussions] = useState<Discussion[]>(mockDiscussions);
  const [filters, setFilters] = useState<CommunityFilters>({
    storyType: "all",
    discussionTopic: "all",
    location: "Malaysia", // Default to user's country
    storySearchQuery: "",
    discussionSearchQuery: "",
  });

  const setStoryTypeFilter = useCallback((type: StoryType | "all") => {
    setFilters((prev) => ({ ...prev, storyType: type }));
  }, []);

  const setDiscussionTopicFilter = useCallback((topic: DiscussionTopic | "all") => {
    setFilters((prev) => ({ ...prev, discussionTopic: topic }));
  }, []);

  const setLocationFilter = useCallback((location: string | "global") => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  const setStorySearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, storySearchQuery: query }));
  }, []);

  const setDiscussionSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, discussionSearchQuery: query }));
  }, []);

  const toggleStoryLike = useCallback((storyId: string) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? {
              ...story,
              isLiked: !story.isLiked,
              likes: story.isLiked ? story.likes - 1 : story.likes + 1,
            }
          : story
      )
    );
  }, []);

  const toggleStorySave = useCallback((storyId: string) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? {
              ...story,
              isSaved: !story.isSaved,
              saves: story.isSaved ? story.saves - 1 : story.saves + 1,
            }
          : story
      )
    );
  }, []);

  const filteredStories = stories.filter((story) => {
    if (filters.storyType !== "all" && story.storyType !== filters.storyType) {
      return false;
    }
    if (filters.storySearchQuery) {
      const query = filters.storySearchQuery.toLowerCase();
      return (
        story.title.toLowerCase().includes(query) ||
        story.excerpt.toLowerCase().includes(query) ||
        story.location.country.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const filteredDiscussions = discussions.filter((discussion) => {
    if (
      filters.discussionTopic !== "all" &&
      discussion.topic !== filters.discussionTopic
    ) {
      return false;
    }
    if (
      filters.location !== "global" &&
      discussion.location.country !== filters.location
    ) {
      return false;
    }
    if (filters.discussionSearchQuery) {
      const query = filters.discussionSearchQuery.toLowerCase();
      return (
        discussion.title.toLowerCase().includes(query) ||
        discussion.details?.toLowerCase().includes(query) ||
        discussion.location.country.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <CommunityContext.Provider
      value={{
        mode,
        setMode,
        stories,
        discussions,
        filters,
        setStoryTypeFilter,
        setDiscussionTopicFilter,
        setLocationFilter,
        setStorySearchQuery,
        setDiscussionSearchQuery,
        toggleStoryLike,
        toggleStorySave,
        filteredStories,
        filteredDiscussions,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}
