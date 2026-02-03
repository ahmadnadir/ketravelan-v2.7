import { X } from "lucide-react";
import { UserSocialProfile } from "@/hooks/useStoryDraft";
import { SocialPlatform } from "@/data/communityMockData";

interface SocialLinksCardProps {
  links: UserSocialProfile[];
  onRemoveLink: (profile: UserSocialProfile) => void;
}

const platformIcons: Record<SocialPlatform, string> = {
  instagram: "📷",
  tiktok: "🎵",
  youtube: "📺",
  facebook: "📘",
  twitter: "🐦",
};

export function SocialLinksCard({ links, onRemoveLink }: SocialLinksCardProps) {
  if (links.length === 0) return null;

  return (
    <div className="my-4 p-3 bg-muted/50 rounded-xl border border-border">
      <p className="text-xs text-muted-foreground mb-2">Follow me on</p>
      <div className="space-y-1.5">
        {links.map((link) => (
          <div
            key={`${link.platform}-${link.handle}`}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <span>{platformIcons[link.platform]}</span>
              <span className="text-sm font-medium text-foreground">{link.handle}</span>
            </div>
            <button
              onClick={() => onRemoveLink(link)}
              className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
