import { useState } from "react";
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

  // Generate auto tags based on draft content
  const generateTags = (): string[] => {
    const tags: string[] = [];
    if (draft.country) tags.push(draft.country.toLowerCase());
    if (draft.city) tags.push(draft.city.toLowerCase());
    if (draft.storyType) {
      const typeLabel = storyTypeLabels[draft.storyType];
      tags.push(typeLabel.toLowerCase().replace(/\s+/g, "-"));
    }
    return tags;
  };

  const [tags, setTags] = useState<string[]>(draft.tags?.length ? draft.tags : generateTags());

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    saveDraft({ tags: newTags });
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Story published successfully!");
    onPublish();
  };

  const handleSaveDraft = () => {
    toast.success("Story saved as draft");
    onSaveAsDraft();
  };

  return (
    <div className="p-4 space-y-6 pb-40">
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
            <Badge variant="secondary" className="text-xs">
              {draft.storyType && storyTypeLabels[draft.storyType]}
            </Badge>
            <h3 className="font-semibold text-lg">{draft.title}</h3>
            <p className="text-sm text-muted-foreground">
              {draft.country}{draft.city && `, ${draft.city}`}
            </p>
          </div>
        </Card>
      </div>

      {/* Auto-generated Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tags</Label>
        <p className="text-xs text-muted-foreground">
          Auto-generated based on your story. Remove any you don't want.
        </p>
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 safe-bottom">
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
