import { useMemo, useState } from "react";
import { Eye, Globe, Users, User, Instagram, Youtube, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StoryDraft } from "@/hooks/useStoryDraft";
import { StoryVisibility, SocialLink, SocialPlatform, storyTypeLabels } from "@/data/communityMockData";
import { toast } from "sonner";

interface PublishStepProps {
  draft: StoryDraft;
  saveDraft: (updates: Partial<StoryDraft>) => void;
  onPublish: () => void;
  onSaveAsDraft: () => void;
  onBack: () => void;
}

const visibilityOptions: { value: StoryVisibility; label: string; description: string; icon: typeof Globe }[] = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can see this story",
    icon: Globe,
  },
  {
    value: "community",
    label: "Community Only",
    description: "Only logged-in users can see",
    icon: Users,
  },
  {
    value: "profile",
    label: "Profile Only",
    description: "Only visible on your profile",
    icon: User,
  },
];

const socialPlatforms: { value: SocialPlatform; label: string; icon: typeof Instagram; placeholder: string }[] = [
  { value: "instagram", label: "Instagram", icon: Instagram, placeholder: "instagram.com/username" },
  { value: "youtube", label: "YouTube", icon: Youtube, placeholder: "youtube.com/@channel" },
  { value: "tiktok", label: "TikTok", icon: Link2, placeholder: "tiktok.com/@username" },
];

export function PublishStep({
  draft,
  saveDraft,
  onPublish,
  onSaveAsDraft,
  onBack,
}: PublishStepProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialPlatform | null>(null);
  const [newSocialUrl, setNewSocialUrl] = useState("");

  const [tagInput, setTagInput] = useState("");

  const normalizeTag = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/^#/, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const tags = draft.tags || [];

  const suggestedTags = useMemo(() => {
    const s = new Set<string>();
    if (draft.country) s.add(normalizeTag(draft.country));
    if (draft.city) s.add(normalizeTag(draft.city));
    (draft.storyFocuses || []).forEach((f) => s.add(normalizeTag(f)));
    tags.forEach((t) => s.delete(t));
    return Array.from(s).filter(Boolean).slice(0, 10);
  }, [draft.country, draft.city, draft.storyFocuses, tags]);

  const handleRemoveTag = (tag: string) => {
    saveDraft({ tags: tags.filter((t) => t !== tag) });
  };

  const handleAddTag = (raw: string) => {
    const next = normalizeTag(raw);
    if (!next) return;
    if (tags.includes(next)) return;
    saveDraft({ tags: [...tags, next] });
    setTagInput("");
  };

  const handleVisibilityChange = (visibility: StoryVisibility) => {
    saveDraft({ visibility });
  };

  const handleAddSocialLink = () => {
    if (newSocialPlatform && newSocialUrl.trim()) {
      const newLinks: SocialLink[] = [
        ...(draft.socialLinks || []),
        { platform: newSocialPlatform, url: newSocialUrl.trim() },
      ];
      saveDraft({ socialLinks: newLinks });
      setNewSocialPlatform(null);
      setNewSocialUrl("");
    }
  };

  const handleRemoveSocialLink = (platform: SocialPlatform) => {
    const newLinks = (draft.socialLinks || []).filter((l) => l.platform !== platform);
    saveDraft({ socialLinks: newLinks });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Small delay for UX feedback, actual publish happens in parent
    await new Promise((resolve) => setTimeout(resolve, 500));
    onPublish();
  };

  const handleSaveDraft = () => {
    toast.success("Story saved as draft");
    onSaveAsDraft();
  };

  return (
    <div className="p-4 space-y-6 pb-48">
      {/* Preview Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Preview</Label>
        </div>
        <Card className="overflow-hidden">
          {draft.coverImage && (
            <div className="aspect-[16/9]">
              <img
                src={draft.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {draft.storyType && (
                <Badge variant="secondary" className="text-xs">
                  {storyTypeLabels[draft.storyType]}
                </Badge>
              )}
              {(draft.storyFocuses || []).slice(0, 3).map((focus) => (
                <Badge key={focus} variant="outline" className="text-xs">
                  {focus.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
            <h3 className="font-semibold text-lg">{draft.title}</h3>
            <p className="text-sm text-muted-foreground">
              {draft.country}{draft.city && `, ${draft.city}`}
            </p>
          </div>
        </Card>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tags</Label>
        <p className="text-xs text-muted-foreground">Tags help others discover your story.</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="gap-1 pr-1"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 p-0.5 hover:bg-muted rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(tagInput);
              }
            }}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={() => handleAddTag(tagInput)}>
            Add
          </Button>
        </div>

        {tags.length === 0 && suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleAddTag(t)}
                  className="rounded-full px-3 py-1.5 text-sm border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Social Links (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          Add links to related content on your social profiles
        </p>
        
        {/* Existing links */}
        {(draft.socialLinks || []).map((link) => {
          const platform = socialPlatforms.find((p) => p.value === link.platform);
          const Icon = platform?.icon || Link2;
          return (
            <div key={link.platform} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">{link.url}</span>
              <button
                onClick={() => handleRemoveSocialLink(link.platform)}
                className="p-1 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {/* Add new link */}
        {newSocialPlatform ? (
          <div className="flex gap-2">
            <Input
              value={newSocialUrl}
              onChange={(e) => setNewSocialUrl(e.target.value)}
              placeholder={socialPlatforms.find((p) => p.value === newSocialPlatform)?.placeholder}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddSocialLink}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
              setNewSocialPlatform(null);
              setNewSocialUrl("");
            }}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            {socialPlatforms
              .filter((p) => !(draft.socialLinks || []).find((l) => l.platform === p.value))
              .map((platform) => (
                <Button
                  key={platform.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewSocialPlatform(platform.value)}
                  className="gap-1"
                >
                  <platform.icon className="h-4 w-4" />
                  {platform.label}
                </Button>
              ))}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Who can see this?</Label>
        <div className="space-y-2">
          {visibilityOptions.map((option) => (
            <Card
              key={option.value}
              onClick={() => handleVisibilityChange(option.value)}
              className={`p-3 cursor-pointer transition-all ${
                draft.visibility === option.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <option.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    draft.visibility === option.value
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {draft.visibility === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="container max-w-3xl mx-auto space-y-2">
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full"
            size="lg"
          >
            {isPublishing ? "Publishing..." : "Publish Story"}
          </Button>
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
