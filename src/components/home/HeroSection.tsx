import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InteractivePhoneMockup } from "./InteractivePhoneMockup";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-6 sm:py-10 md:py-14 overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column - Value Proposition */}
        <div className="space-y-6 text-center lg:text-left">
          {/* Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Plan Trips. Split Costs.{" "}
              <span className="whitespace-nowrap">No Awkward Math.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
              Whether you're traveling with best friends or new travel buddies, track shared expenses in real-time. No more 'I'll pay first' anxiety—everyone knows exactly what they owe.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
            <Link to={isAuthenticated ? "/create" : "/auth"} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-full w-full sm:w-auto px-6 sm:px-8 h-12 text-base font-medium"
              >
                Create Trip
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/explore" : "/auth"} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-full sm:w-auto px-6 sm:px-8 h-12 text-base font-medium"
              >
                Find Trip
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
