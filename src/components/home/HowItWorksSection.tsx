import { Link } from "react-router-dom";
import { PlusCircle, MessageSquare, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const diyContent = {
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
  secondaryCta: { label: "Browse DIY Trips", link: "/explore" },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="space-y-4 sm:space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">
        How You Can Travel with Ketravelan
      </h2>

      {/* Flow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {diyContent.cards.map((card, index) => (
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
        <Link to={diyContent.primaryCta.link} className="w-full sm:w-auto">
          <Button className="rounded-full w-full sm:w-auto">
            {diyContent.primaryCta.label}
          </Button>
        </Link>
        <Link to={diyContent.secondaryCta.link} className="w-full sm:w-auto">
          <Button variant="ghost" className="rounded-full w-full sm:w-auto">
            {diyContent.secondaryCta.label} →
          </Button>
        </Link>
      </div>
    </section>
  );
}
