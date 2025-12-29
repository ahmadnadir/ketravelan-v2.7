import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, QrCode, Users, CreditCard, BadgeCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TripMode = "diy" | "guided";

const heroContent = {
  diy: {
    bullets: [
      { icon: MessageCircle, text: "Group chat as your basecamp" },
      { icon: QrCode, text: "Transparent expense splitting with QR" },
      { icon: Users, text: "Cost sharing to upgrade experiences" },
    ],
    primaryCta: { label: "Create a DIY Trip", link: "/create" },
    secondaryCta: { label: "Explore DIY Trips", link: "/explore?type=diy" },
  },
  guided: {
    bullets: [
      { icon: CreditCard, text: "Low deposit, flexible payment plans" },
      { icon: BadgeCheck, text: "Verified hosts & curated itineraries" },
      { icon: FileText, text: "Payments, chat, and documents in one place" },
    ],
    primaryCta: { label: "Explore Guided Trips", link: "/explore?type=guided" },
    secondaryCta: { label: "How Guided Trips Work", link: "#how-it-works" },
  },
};

export function HeroSection() {
  const [tripMode, setTripMode] = useState<TripMode>("diy");
  const content = heroContent[tripMode];

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Headline */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Go DIY or Go Guided
          <br />
          <span className="text-primary">You'll Get There Either Way</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          DIY trips let you plan with friends and community. Guided trips connect you with trusted hosts. 
          Same platform, same clarity, same tools.
        </p>
      </div>

      {/* Interactive Pills */}
      <div className="flex justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setTripMode("diy")}
          className={cn(
            "px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200",
            tripMode === "diy"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          DIY Trips
        </button>
        <button
          onClick={() => setTripMode("guided")}
          className={cn(
            "px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200",
            tripMode === "guided"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Guided Trips
        </button>
      </div>

      {/* Dynamic Bullets */}
      <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto">
        {content.bullets.map((bullet, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-foreground"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <bullet.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="text-sm sm:text-base">{bullet.text}</span>
          </div>
        ))}
      </div>

      {/* Dynamic CTAs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pt-2">
        <Link to={content.primaryCta.link} className="w-full sm:w-auto">
          <Button size="lg" className="rounded-full w-full sm:w-auto">
            {content.primaryCta.label}
          </Button>
        </Link>
        <Link to={content.secondaryCta.link} className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
            {content.secondaryCta.label}
          </Button>
        </Link>
      </div>
    </section>
  );
}
