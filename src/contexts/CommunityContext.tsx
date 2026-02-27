import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  Story,
  Discussion,
  StoryType,
  DiscussionTopic,
  mockStories,
  mockDiscussions,
  StoryBlock,
  StoryVisibility,
  SocialLink,
} from "@/data/communityMockData";
import { StoryDraft } from "@/hooks/useStoryDrafts";
import { blocksToLegacy } from "@/lib/storyEditorBlocks";

type CommunityMode = "stories" | "discussions";

export interface StoryComment {
  id: string;
  storyId: string;
  author: { name: string; avatar: string };
  content: string;
  createdAt: Date;
}

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
  publishStory: (draft: StoryDraft) => Story;
  updateStory: (storyId: string, draft: StoryDraft) => Story | null;
  getStoryById: (storyId: string) => Story | undefined;
  comments: StoryComment[];
  addComment: (storyId: string, content: string) => void;
  getCommentsForStory: (storyId: string) => StoryComment[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const PUBLISHED_STORIES_KEY = "ketravelan-published-stories";
const STORY_COMMENTS_KEY = "ketravelan-story-comments";

// Helper to generate URL-friendly slugs
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) + "-" + Date.now().toString(36);
}

// Helper to estimate reading time
function estimateReadingTime(blocks: StoryBlock[]): number {
  const totalWords = blocks.reduce((count, block) => {
    const words = (block.content || "").split(/\s+/).filter(Boolean).length;
    return count + words;
  }, 0);
  return Math.max(1, Math.ceil(totalWords / 200)); // ~200 words per minute
}

// Load published stories from localStorage
function loadPublishedStories(): Story[] {
  try {
    const saved = localStorage.getItem(PUBLISHED_STORIES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((s: Story) => ({
        ...s,
        createdAt: new Date(s.createdAt),
      }));
    }
  } catch (e) {
    console.error("Failed to load published stories:", e);
  }
  return [];
}

// Load comments from localStorage
function loadComments(): StoryComment[] {
  try {
    const saved = localStorage.getItem(STORY_COMMENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((c: StoryComment) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
    }
  } catch (e) {
    console.error("Failed to load comments:", e);
  }
  return [];
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CommunityMode>("stories");
  const [stories, setStories] = useState<Story[]>(() => {
    const published = loadPublishedStories();
    // Merge published stories at the top, then mock stories
    return [...published, ...mockStories];
  });
  const [discussions] = useState<Discussion[]>(mockDiscussions);
  const [comments, setComments] = useState<StoryComment[]>(() => loadComments());
  const [filters, setFilters] = useState<CommunityFilters>({
    storyType: "all",
    discussionTopic: "all",
    location: "Malaysia", // Default to user's country
    storySearchQuery: "",
    discussionSearchQuery: "",
  });

  // Persist published stories (non-mock ones) to localStorage
  useEffect(() => {
    const published = stories.filter((s) => !mockStories.find((m) => m.id === s.id));
    if (published.length > 0) {
      localStorage.setItem(PUBLISHED_STORIES_KEY, JSON.stringify(published));
    }
  }, [stories]);

  // Persist comments to localStorage
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(STORY_COMMENTS_KEY, JSON.stringify(comments));
    }
  }, [comments]);

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

  const publishStory = useCallback((draft: StoryDraft): Story => {
    const slug = generateSlug(draft.title);

    // Derive legacy fields from editorBlocks
    const legacy = blocksToLegacy(draft.editorBlocks);

    // Convert inline media from derived legacy for story format
    const storyInlineMedia = legacy.inlineMedia.map((media) => ({
      id: media.id,
      type: media.type,
      images: media.images,
      insertPosition: media.insertPosition,
    }));

    const allText = [legacy.content, ...legacy.inlineMedia.map(m => m.contentAfter || ""), legacy.contentAfterMedia]
      .join(" ").replace(/<[^>]*>/g, "");

    const newStory: Story = {
      id: `story-${Date.now()}`,
      slug,
      title: draft.title,
      coverImage: draft.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
      excerpt: allText.slice(0, 150) || draft.title,
      content: legacy.content,
      contentAfterMedia: legacy.contentAfterMedia || undefined,
      blocks: draft.blocks,
      inlineMedia: storyInlineMedia.length > 0 ? storyInlineMedia : undefined,
      selectedSocialLinks: draft.selectedSocialLinks.length > 0 ? draft.selectedSocialLinks : undefined,
      editorBlocks: draft.editorBlocks,
      author: {
        id: "current-user",
        name: "You",
        avatar: "https://i.pravatar.cc/150?u=current-user",
        socialLinks: draft.socialLinks,
      },
      location: {
        country: draft.country,
        city: draft.city || undefined,
        flag: getCountryFlag(draft.country),
      },
      readingTime: Math.max(1, Math.ceil(allText.split(/\s+/).length / 200)),
      storyType: draft.storyType || "trip-recap",
      linkedTripId: draft.linkedTripId || undefined,
      visibility: draft.visibility,
      tags: [],
      socialLinks: draft.socialLinks,
      likes: 0,
      saves: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(),
    };

    setStories((prev) => [newStory, ...prev]);
    return newStory;
  }, []);

  const updateStory = useCallback((storyId: string, draft: StoryDraft): Story | null => {
    let updatedStory: Story | null = null;

    const legacy = blocksToLegacy(draft.editorBlocks);
    const storyInlineMedia = legacy.inlineMedia.map((media) => ({
      id: media.id,
      type: media.type,
      images: media.images,
      insertPosition: media.insertPosition,
    }));

    const allText = [legacy.content, ...legacy.inlineMedia.map(m => m.contentAfter || ""), legacy.contentAfterMedia]
      .join(" ").replace(/<[^>]*>/g, "");

    setStories((prev) => {
      return prev.map((story) => {
        if (story.id === storyId) {
          updatedStory = {
            ...story,
            title: draft.title,
            coverImage: draft.coverImage || story.coverImage,
            excerpt: allText.slice(0, 150) || draft.title,
            content: legacy.content,
            contentAfterMedia: legacy.contentAfterMedia || undefined,
            blocks: draft.blocks,
            inlineMedia: storyInlineMedia.length > 0 ? storyInlineMedia : undefined,
            selectedSocialLinks: draft.selectedSocialLinks.length > 0 ? draft.selectedSocialLinks : undefined,
            editorBlocks: draft.editorBlocks,
            location: {
              country: draft.country || story.location.country,
              city: draft.city || story.location.city,
              flag: getCountryFlag(draft.country || story.location.country),
            },
            readingTime: Math.max(1, Math.ceil(allText.split(/\s+/).length / 200)),
            storyType: draft.storyType || story.storyType,
            visibility: draft.visibility,
            socialLinks: draft.socialLinks,
          };
          return updatedStory;
        }
        return story;
      });
    });
    
    return updatedStory;
  }, []);

  const getStoryById = useCallback((storyId: string): Story | undefined => {
    return stories.find((s) => s.id === storyId);
  }, [stories]);

  const addComment = useCallback((storyId: string, content: string) => {
    const newComment: StoryComment = {
      id: `comment-${Date.now()}`,
      storyId,
      author: { name: "You", avatar: "https://i.pravatar.cc/150?u=current-user" },
      content,
      createdAt: new Date(),
    };
    setComments((prev) => [newComment, ...prev]);
  }, []);

  const getCommentsForStory = useCallback(
    (storyId: string) => {
      return comments.filter((c) => c.storyId === storyId);
    },
    [comments]
  );

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
        publishStory,
        updateStory,
        getStoryById,
        comments,
        addComment,
        getCommentsForStory,
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

// Helper to get country flag emoji
function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    Malaysia: "🇲🇾",
    Thailand: "🇹🇭",
    Vietnam: "🇻🇳",
    Indonesia: "🇮🇩",
    Japan: "🇯🇵",
    "South Korea": "🇰🇷",
    Philippines: "🇵🇭",
    Singapore: "🇸🇬",
    Taiwan: "🇹🇼",
    China: "🇨🇳",
    India: "🇮🇳",
    Australia: "🇦🇺",
    "New Zealand": "🇳🇿",
    "United Kingdom": "🇬🇧",
    France: "🇫🇷",
    Germany: "🇩🇪",
    Italy: "🇮🇹",
    Spain: "🇪🇸",
    "United States": "🇺🇸",
  };
  return flags[country] || "🌍";
}
