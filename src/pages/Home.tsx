import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { TripCard } from "@/components/shared/TripCard";
import { Button } from "@/components/ui/button";
import { mockTrips } from "@/data/mockData";

const heroImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200",
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <AppLayout>
      <div className="py-6 space-y-8">
        {/* Hero Carousel */}
        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden">
          <img
            src={heroImages[currentSlide]}
            alt="Hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Travel with People Who Get You.
          </h1>
          <p className="text-muted-foreground">
            Chat-first travel. Connect first, travel second. Split costs, vibe together.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/explore">
              <Button size="lg" className="rounded-full">
                Explore Trips
              </Button>
            </Link>
            <Link to="/create">
              <Button size="lg" variant="outline" className="rounded-full">
                Create a Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Trips */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Featured Trips</h2>
            <Link to="/explore" className="text-sm text-primary font-medium">
              See all
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {mockTrips.slice(0, 3).map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                className="min-w-[300px] shrink-0"
              />
            ))}
          </div>
        </section>

        {/* Upcoming Trips Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Trips</h2>
            <Link to="/explore" className="text-sm text-primary font-medium">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {mockTrips.slice(0, 2).map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}