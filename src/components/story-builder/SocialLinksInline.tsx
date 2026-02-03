import { X } from "lucide-react";
import { UserSocialProfile } from "@/hooks/useStoryDraft";
import { SocialPlatform } from "@/data/communityMockData";

interface SocialLinksInlineProps {
  links: UserSocialProfile[];
  onRemoveLink: (profile: UserSocialProfile) => void;
}

const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  twitter: "Twitter",
};

export function SocialLinksInline({ links, onRemoveLink }: SocialLinksInlineProps) {
  if (links.length === 0) return null;

  return (
    <div className="my-8 group/social">
      <p className="text-muted-foreground text-lg mb-2">You can find me on:</p>
      <div className="space-y-0.5">
        {links.map((link) => (
          <div
            key={`${link.platform}-${link.handle}`}
            className="flex items-center gap-2 group/item"
          >
            <span className="text-foreground text-lg">
              {platformLabels[link.platform]} · <span className="font-medium">{link.handle}</span>
            </span>
            <button
              onClick={() => onRemoveLink(link)}
              className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
