import { useState, useEffect } from "react";
import { MapPin, Link2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoryDraft } from "@/hooks/useStoryDraft";
import {
  StoryType,
  newStoryTypes,
  storyTypeLabels,
  countries,
  storyTitleExamples,
} from "@/data/communityMockData";

interface StorySetupStepProps {
  draft: StoryDraft;
  onComplete: (data: Partial<StoryDraft>) => void;
}

// Mock past trips - in a real app, this would come from user data
const mockPastTrips = [
  { id: "trip-1", title: "Vietnam Adventure", destination: "Vietnam" },
  { id: "trip-2", title: "Japan Solo Trip", destination: "Japan" },
  { id: "trip-3", title: "Bali Getaway", destination: "Indonesia" },
];

const storyTypeDescriptions: Record<StoryType, string> = {
  "trip-recap": "Share highlights from your entire trip journey",
  "lesson-insight": "What did you learn? Share wisdom with others",
  "destination-snapshot": "Capture the essence of a specific place",
  "lessons-learned": "What did you learn? Share wisdom with others",
  "budget-breakdown": "Share how you spent your money",
  "first-time-diy": "First time traveling somewhere? Share the experience",
  "solo-to-group": "From solo to group travel stories",
  "mistakes-wins": "Share your travel mistakes and wins",
};

export function StorySetupStep({ draft, onComplete }: StorySetupStepProps) {
  const [title, setTitle] = useState(draft.title);
  const [storyType, setStoryType] = useState<StoryType | null>(draft.storyType);
  const [country, setCountry] = useState(draft.country);
  const [city, setCity] = useState(draft.city);
  const [linkedTripId, setLinkedTripId] = useState<string | null>(draft.linkedTripId);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % storyTitleExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkTrip = (tripId: string) => {
    if (tripId === linkedTripId) {
      setLinkedTripId(null);
    } else {
      setLinkedTripId(tripId);
      // Auto-fill destination from trip
      const trip = mockPastTrips.find((t) => t.id === tripId);
      if (trip) {
        const matchingCountry = countries.find((c) => 
          trip.destination.toLowerCase().includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(trip.destination.toLowerCase())
        );
        if (matchingCountry) {
          setCountry(matchingCountry.name);
        }
      }
    }
  };

  const isValid = title.trim() && storyType && country;

  const handleContinue = () => {
    if (isValid) {
      onComplete({
        title: title.trim(),
        storyType,
        country,
        city,
        linkedTripId,
      });
    }
  };

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Let's start your story</h2>
        <p className="text-muted-foreground">
          First, tell us a bit about what you're sharing
        </p>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Story Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={storyTitleExamples[placeholderIndex]}
          className="text-lg h-12"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground text-right">
          {title.length}/100
        </p>
      </div>

      {/* Story Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          What kind of story is this? <span className="text-destructive">*</span>
        </Label>
        <div className="grid gap-3">
          {newStoryTypes.map((type) => (
            <Card
              key={type}
              onClick={() => setStoryType(type)}
              className={`p-4 cursor-pointer transition-all ${
                storyType === type
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {storyTypeLabels[type]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {storyTypeDescriptions[type]}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    storyType === type
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {storyType === type && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Destination */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Where did this happen? <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (optional)"
          />
        </div>
      </div>

      {/* Link to Trip */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Link to a Ketravelan trip (optional)
        </Label>
        <p className="text-sm text-muted-foreground">
          Connect this story to one of your past trips
        </p>
        <div className="space-y-2">
          {mockPastTrips.map((trip) => (
            <Card
              key={trip.id}
              onClick={() => handleLinkTrip(trip.id)}
              className={`p-3 cursor-pointer transition-all ${
                linkedTripId === trip.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{trip.title}</p>
                  <p className="text-xs text-muted-foreground">{trip.destination}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded border ${
                    linkedTripId === trip.id
                      ? "border-primary bg-primary text-white flex items-center justify-center"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {linkedTripId === trip.id && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Continue Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 safe-bottom">
        <div className="container max-w-3xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full gap-2"
            size="lg"
          >
            Continue to Story Builder
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
