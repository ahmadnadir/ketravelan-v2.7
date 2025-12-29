import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InteractivePhoneMockup } from "./InteractivePhoneMockup";

export function HeroSection() {
  return (
    <section className="py-6 sm:py-10 md:py-14">
      <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left Column - Value Proposition */}
        <div className="space-y-6 text-center md:text-left order-1">
          {/* Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Find Your Travel Buddy.
              <br />
              <span className="text-muted-foreground font-medium text-xl sm:text-2xl md:text-3xl block mt-1 sm:mt-2">
                The trip figures itself out.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
              Post a trip or join one. Chat, plan, and split costs with people
              who match your vibe — DIY or guided.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
            <Link to="/create" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-full w-full sm:w-auto px-6 sm:px-8 h-12 text-base font-medium"
              >
                Find a Travel Buddy
              </Button>
            </Link>
            <Link to="/explore" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-full sm:w-auto px-6 sm:px-8 h-12 text-base font-medium"
              >
                Browse Open Trips
              </Button>
            </Link>
          </div>

          {/* Trust Micro-cue - Desktop: below CTAs, Mobile: at bottom */}
          <p className="text-sm text-muted-foreground hidden md:block">
            Real people · Verified profiles · Transparent costs
          </p>
        </div>

        {/* Right Column - Interactive Mockup */}
        <div className="order-2 flex justify-center md:justify-end">
          <InteractivePhoneMockup />
        </div>

        {/* Trust Micro-cue - Mobile only, shown after mockup */}
        <p className="text-sm text-muted-foreground text-center md:hidden order-3 col-span-full">
          Real people · Verified profiles · Transparent costs
        </p>
      </div>
    </section>
  );
}
