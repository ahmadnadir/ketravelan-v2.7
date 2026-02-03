import { useState, useEffect, useCallback } from "react";
import { StoryBlock, StoryType, StoryVisibility, SocialLink, StoryFocus, SocialPlatform } from "@/data/communityMockData";

// Inline media for the rich text editor
export interface InlineMediaImage {
  url: string;
  caption?: string;
}

export interface InlineMedia {
  id: string;
  type: "image" | "gallery";
  images: InlineMediaImage[];
  insertPosition: number; // character index in content
}

// User social profile for profile-aware social link insertion
export interface UserSocialProfile {
  platform: SocialPlatform;
  handle: string;
}

export interface StoryDraft {
  title: string;
  storyType: StoryType | null;
  storyFocuses: StoryFocus[];
  travelStyles: string[];
  customStoryTypes: string[];
  customTravelStyles: string[];
  country: string;
  city: string;
  linkedTripId: string | null;
  coverImage: string | null;
  // Rich text editor content
  content: string;
  inlineMedia: InlineMedia[];
  // Selected social links from profile
  selectedSocialLinks: UserSocialProfile[];
  // Legacy blocks for backwards compatibility
  blocks: StoryBlock[];
  visibility: StoryVisibility;
  socialLinks: SocialLink[];
  lastSaved: Date;
}

const DRAFT_KEY = "ketravelan-story-draft";

const defaultDraft: StoryDraft = {
  title: "",
  storyType: null,
  storyFocuses: [],
  travelStyles: [],
  customStoryTypes: [],
  customTravelStyles: [],
  country: "",
  city: "",
  linkedTripId: null,
  coverImage: null,
  content: "",
  inlineMedia: [],
  selectedSocialLinks: [],
  blocks: [],
  visibility: "public",
  socialLinks: [],
  lastSaved: new Date(),
};

// Mock user social profiles (in a real app, this would come from user settings)
export const mockUserSocialProfiles: UserSocialProfile[] = [
  { platform: "instagram", handle: "@ahmadrazak" },
  { platform: "youtube", handle: "@ahmadtravels" },
  { platform: "tiktok", handle: "@ahmadtiktok" },
];

export function useStoryDraft() {
  const [draft, setDraft] = useState<StoryDraft>(defaultDraft);
  const [hasDraft, setHasDraft] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Migrate older drafts safely
        const migrated: StoryDraft = {
          ...defaultDraft,
          ...parsed,
          storyFocuses: Array.isArray(parsed.storyFocuses) ? parsed.storyFocuses : [],
          travelStyles: Array.isArray(parsed.travelStyles) ? parsed.travelStyles : [],
          customStoryTypes: Array.isArray(parsed.customStoryTypes) ? parsed.customStoryTypes : [],
          customTravelStyles: Array.isArray(parsed.customTravelStyles) ? parsed.customTravelStyles : [],
          blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
          content: parsed.content || "",
          inlineMedia: Array.isArray(parsed.inlineMedia) ? parsed.inlineMedia : [],
          selectedSocialLinks: Array.isArray(parsed.selectedSocialLinks) ? parsed.selectedSocialLinks : [],
          lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : new Date(),
        };

        // Migrate legacy blocks to content if content is empty
        if (!migrated.content && migrated.blocks.length > 0) {
          const textContent = migrated.blocks
            .filter((b: StoryBlock) => b.type === "text" || b.type === "moment" || b.type === "lesson" || b.type === "tip")
            .map((b: StoryBlock) => b.content)
            .filter(Boolean)
            .join("\n\n");
          
          const imageMedia: InlineMedia[] = migrated.blocks
            .filter((b: StoryBlock) => b.type === "image" && b.imageUrl)
            .map((b: StoryBlock, index: number) => ({
              id: b.id,
              type: "image" as const,
              images: [{ url: b.imageUrl!, caption: b.caption }],
              insertPosition: index * 100, // Approximate positions
            }));
          
          migrated.content = textContent;
          migrated.inlineMedia = imageMedia;
        }

        // Unify legacy text-ish blocks into one flexible text block
        migrated.blocks = migrated.blocks.map((b: StoryBlock) => {
          if (b.type === "moment") {
            return { ...b, type: "text", textPrompt: b.textPrompt ?? "what-happened" };
          }
          if (b.type === "lesson") {
            return { ...b, type: "text", textPrompt: b.textPrompt ?? "lesson" };
          }
          if (b.type === "tip") {
            return { ...b, type: "text", textPrompt: b.textPrompt ?? "tip" };
          }
          return b;
        });

        setDraft(migrated);
        setHasDraft(true);
      } catch (e) {
        console.error("Failed to parse story draft:", e);
      }
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = useCallback((updates: Partial<StoryDraft>) => {
    setDraft((prev) => {
      const newDraft = {
        ...prev,
        ...updates,
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      setHasDraft(true);
      return newDraft;
    });
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(defaultDraft);
    setHasDraft(false);
  }, []);

  // Update a specific block
  const updateBlock = useCallback((blockId: string, updates: Partial<StoryBlock>) => {
    setDraft((prev) => {
      const newBlocks = prev.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );
      const newDraft = {
        ...prev,
        blocks: newBlocks,
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      return newDraft;
    });
  }, []);

  // Add a new block
  const addBlock = useCallback((block: StoryBlock) => {
    setDraft((prev) => {
      const newDraft = {
        ...prev,
        blocks: [...prev.blocks, block],
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      setHasDraft(true);
      return newDraft;
    });
  }, []);

  // Remove a block
  const removeBlock = useCallback((blockId: string) => {
    setDraft((prev) => {
      const newDraft = {
        ...prev,
        blocks: prev.blocks.filter((block) => block.id !== blockId),
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      return newDraft;
    });
  }, []);

  // Reorder blocks
  const reorderBlocks = useCallback((blocks: StoryBlock[]) => {
    setDraft((prev) => {
      const newDraft = {
        ...prev,
        blocks,
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      return newDraft;
    });
  }, []);

  // Add inline media (image or gallery)
  const addInlineMedia = useCallback((media: InlineMedia) => {
    setDraft((prev) => {
      const newDraft = {
        ...prev,
        inlineMedia: [...prev.inlineMedia, media],
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      setHasDraft(true);
      return newDraft;
    });
  }, []);

  // Update inline media caption
  const updateInlineMedia = useCallback((mediaId: string, updates: Partial<InlineMedia>) => {
    setDraft((prev) => {
      const newMedia = prev.inlineMedia.map((m) =>
        m.id === mediaId ? { ...m, ...updates } : m
      );
      const newDraft = {
        ...prev,
        inlineMedia: newMedia,
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      return newDraft;
    });
  }, []);

  // Remove inline media
  const removeInlineMedia = useCallback((mediaId: string) => {
    setDraft((prev) => {
      const newDraft = {
        ...prev,
        inlineMedia: prev.inlineMedia.filter((m) => m.id !== mediaId),
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      return newDraft;
    });
  }, []);

  // Toggle social link selection
  const toggleSocialLink = useCallback((profile: UserSocialProfile) => {
    setDraft((prev) => {
      const exists = prev.selectedSocialLinks.some(
        (s) => s.platform === profile.platform && s.handle === profile.handle
      );
      const newLinks = exists
        ? prev.selectedSocialLinks.filter(
            (s) => !(s.platform === profile.platform && s.handle === profile.handle)
          )
        : [...prev.selectedSocialLinks, profile];
      
      const newDraft = {
        ...prev,
        selectedSocialLinks: newLinks,
        lastSaved: new Date(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
      return newDraft;
    });
  }, []);

  return {
    draft,
    hasDraft,
    saveDraft,
    clearDraft,
    updateBlock,
    addBlock,
    removeBlock,
    reorderBlocks,
    addInlineMedia,
    updateInlineMedia,
    removeInlineMedia,
    toggleSocialLink,
  };
}
