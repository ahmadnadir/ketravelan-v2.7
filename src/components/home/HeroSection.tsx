import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InteractivePhoneMockup } from "./InteractivePhoneMockup";

export function HeroSection() {
  return (
    <section className="py-6 sm:py-10 md:py-14 overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column - Value Proposition */}
        <div className="space-y-6 text-center lg:text-left">
          {/* Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Find Your Travel Buddy.
              <br />
              <span className="text-muted-foreground font-medium text-xl sm:text-2xl lg:text-3xl block mt-1 sm:mt-2">
                The trip figures itself out.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
              Post a trip or join one. Chat, plan, and split costs with people
              who match your vibe — DIY or guided.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
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
        </div>

        {/* Right Column - Interactive Mockup */}
        <div className="flex justify-center lg:justify-end w-full">
          <InteractivePhoneMockup />
        </div>
      </div>
    </section>
  );
}
