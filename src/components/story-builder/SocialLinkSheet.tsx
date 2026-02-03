import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UserSocialProfile, mockUserSocialProfiles } from "@/hooks/useStoryDraft";
import { SocialPlatform } from "@/data/communityMockData";

interface SocialLinkSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLinks: UserSocialProfile[];
  onToggleLink: (profile: UserSocialProfile) => void;
}

const platformIcons: Record<SocialPlatform, string> = {
  instagram: "📷",
  tiktok: "🎵",
  youtube: "📺",
  facebook: "📘",
  twitter: "🐦",
};

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  twitter: "Twitter",
};

export function SocialLinkSheet({
  open,
  onOpenChange,
  selectedLinks,
  onToggleLink,
}: SocialLinkSheetProps) {
  const isSelected = (profile: UserSocialProfile) =>
    selectedLinks.some(
      (s) => s.platform === profile.platform && s.handle === profile.handle
    );

  const hasLinkedProfiles = mockUserSocialProfiles.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left pb-4">
          <SheetTitle>Add Social Links</SheetTitle>
        </SheetHeader>

        {hasLinkedProfiles ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Select profiles to include in your story
            </p>
            
            <div className="space-y-2">
              {mockUserSocialProfiles.map((profile) => (
                <button
                  key={`${profile.platform}-${profile.handle}`}
                  onClick={() => onToggleLink(profile)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={isSelected(profile)}
                    onCheckedChange={() => onToggleLink(profile)}
                    className="pointer-events-none"
                  />
                  <span className="text-xl">{platformIcons[profile.platform]}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">
                      {platformLabels[profile.platform]}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile.handle}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              className="w-full mt-4"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No social profiles linked yet
            </p>
            <p className="text-sm text-muted-foreground">
              Link your social profiles in Settings to share them in your stories
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
