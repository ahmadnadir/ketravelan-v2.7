import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function BottomCTASection() {
  return (
    <section className="rounded-2xl sm:rounded-3xl bg-primary p-6 sm:p-10 text-center space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground">
        Ready to Start Your Next Adventure?
      </h2>
      <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md mx-auto">
        Whether you're traveling DIY or joining a guided trip — it all begins with one tap.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pt-2">
        <Link to="/create" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-full sm:w-auto font-semibold"
          >
            Create a DIY Trip
          </Button>
        </Link>
        <Link to="/explore?type=diy" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Explore DIY Trips
          </Button>
        </Link>
        <Link to="/explore?type=guided" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Explore Guided Trips
          </Button>
        </Link>
      </div>
    </section>
  );
}
