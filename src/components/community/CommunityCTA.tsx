import { useNavigate } from "react-router-dom";
import { PenSquare, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface CommunityCTAProps {
  mode: "stories" | "discussions";
  onAskQuestion?: () => void;
}

export function CommunityCTA({ mode, onAskQuestion }: CommunityCTAProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const config = {
    stories: {
      icon: PenSquare,
      label: "Share Your Story",
      action: () => navigate("/create-story"),
    },
    discussions: {
      icon: MessageSquarePlus,
      label: "Ask the Community",
      action: onAskQuestion || (() => {}),
    },
  };

  const { icon: Icon, label, action } = config[mode];

  return (
    <>
      {/* Desktop: Floating button aligned to container */}
      <div
        className="hidden sm:block fixed left-0 right-0 z-40 pointer-events-none transition-opacity duration-150 ease-out"
        style={{ bottom: "calc(var(--bottom-nav-height) + var(--cta-bottom-offset) + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 flex justify-end">
          <Button
            onClick={action}
            className="pointer-events-auto rounded-full shadow-lg gap-2"
            size="lg"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        </div>
      </div>

      {/* Mobile: Full-width sticky bar */}
      <div
        className="sm:hidden fixed left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 transition-opacity duration-150 ease-out"
        style={{ bottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))" }}
      >
        <Button onClick={action} className="w-full gap-2" size="lg">
          <Icon className="h-5 w-5" />
          {label}
        </Button>
      </div>
    </>
  );
}
