import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const cards = [
  {
    emoji: "🚀",
    title: "Create or Join",
    description: "Start a trip or join one that fits you.",
  },
  {
    emoji: "💬",
    title: "Group Chat to communicate and plan",
    description: "Chat, plan, and keep everything in one place.",
  },
  {
    emoji: "💰",
    title: "Transparent Cost Sharing",
    description: "Track expenses and settle up automatically.",
  },
];

const ctaContent = {
  primaryCta: { label: "Start a DIY Trip", link: "/create" },
  secondaryCta: { label: "Browse DIY Trips", link: "/explore" },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="space-y-4 sm:space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">
        Your Trip, Simplified
      </h2>

      {/* Swipeable Cards */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 pl-[calc(50%-140px)] pr-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {cards.map((card, index) => (
          <Card key={index} className="min-w-[280px] sm:min-w-0 snap-start p-4 sm:p-5 space-y-3 border-border/50 flex-shrink-0">
            <div className="text-2xl sm:text-3xl">
              {card.emoji}
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
        <Link to={ctaContent.primaryCta.link} className="w-full sm:w-auto">
          <Button className="rounded-full w-full sm:w-auto">
            {ctaContent.primaryCta.label}
          </Button>
        </Link>
        <Link to={ctaContent.secondaryCta.link} className="w-full sm:w-auto">
          <Button variant="ghost" className="rounded-full w-full sm:w-auto">
            {ctaContent.secondaryCta.label} →
          </Button>
        </Link>
      </div>
    </section>
  );
}
