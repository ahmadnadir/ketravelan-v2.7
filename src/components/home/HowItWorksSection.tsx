import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, MessageSquare, Receipt, Search, CreditCard, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TripMode = "diy" | "guided";

const flowContent = {
  diy: {
    cards: [
      {
        icon: PlusCircle,
        title: "Create or Join Trips",
        description: "Start a trip or join an existing DIY group",
      },
      {
        icon: MessageSquare,
        title: "Group Chat as Your Basecamp",
        description: "Plan, vote, and coordinate in one place",
      },
      {
        icon: Receipt,
        title: "Transparent Cost Sharing",
        description: "Log expenses, split bills, settle via QR",
      },
    ],
    primaryCta: { label: "Start a DIY Trip", link: "/create" },
    secondaryCta: { label: "Browse DIY Trips", link: "/explore?type=diy" },
  },
  guided: {
    cards: [
      {
        icon: Search,
        title: "Browse and Book",
        description: "Find verified hosts with curated itineraries",
      },
      {
        icon: CreditCard,
        title: "Flexible Deposits",
        description: "Secure your spot with low upfront payment",
      },
      {
        icon: FolderOpen,
        title: "Everything in One Place",
        description: "Payments, chat, documents, and updates",
      },
    ],
    primaryCta: { label: "Explore Guided Trips", link: "/explore?type=guided" },
    secondaryCta: { label: "How Deposits Work", link: "#faq" },
  },
};

export function HowItWorksSection() {
  const [tripMode, setTripMode] = useState<TripMode>("diy");
  const content = flowContent[tripMode];

  return (
    <section id="how-it-works" className="space-y-4 sm:space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">
        How You Can Travel with Ketravelan
      </h2>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setTripMode("diy")}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            tripMode === "diy"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          DIY Trips
        </button>
        <button
          onClick={() => setTripMode("guided")}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
            tripMode === "guided"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Guided Trips
        </button>
      </div>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {content.cards.map((card, index) => (
          <Card key={index} className="p-4 sm:p-5 space-y-3 border-border/50">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <card.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base">
              {card.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {card.description}
            </p>
          </Card>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <Link to={content.primaryCta.link} className="w-full sm:w-auto">
          <Button className="rounded-full w-full sm:w-auto">
            {content.primaryCta.label}
          </Button>
        </Link>
        <Link to={content.secondaryCta.link} className="w-full sm:w-auto">
          <Button variant="ghost" className="rounded-full w-full sm:w-auto">
            {content.secondaryCta.label} →
          </Button>
        </Link>
      </div>
    </section>
  );
}
