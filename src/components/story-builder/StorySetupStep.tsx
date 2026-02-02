import { useMemo, useState, useEffect } from "react";
import { 
  MapPin, Link2, ChevronRight, Check,
  Map, Lightbulb, MessageCircle, Compass, Wallet, User, Sparkles,
  Leaf, Mountain, Waves, Utensils, Building2, Landmark, Footprints, 
  Camera, Backpack, BadgeDollarSign, LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoryDraft } from "@/hooks/useStoryDraft";
import {
  countries,
  storyTitleExamples,
  storyFocusOptions,
  travelStyleOptions,
  StoryFocus,
  TravelStyleId,
} from "@/data/communityMockData";

// Icon map for dynamic rendering
const storyTypeIconMap: Record<string, LucideIcon> = {
  Map,
  Lightbulb,
  MessageCircle,
  Compass,
  Wallet,
  User,
  Sparkles,
};

const travelStyleIconMap: Record<string, LucideIcon> = {
  Leaf,
  Mountain,
  Waves,
  Utensils,
  Building2,
  Landmark,
  Footprints,
  Camera,
  Backpack,
  BadgeDollarSign,
};

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

export function StorySetupStep({ draft, onComplete }: StorySetupStepProps) {
  const [title, setTitle] = useState(draft.title);
  const [storyFocuses, setStoryFocuses] = useState<StoryFocus[]>(draft.storyFocuses || []);
  const [travelStyles, setTravelStyles] = useState<TravelStyleId[]>((draft.travelStyles || []) as TravelStyleId[]);
  const [country, setCountry] = useState(draft.country);
  const [city, setCity] = useState(draft.city);
  const [linkedTripId, setLinkedTripId] = useState<string | null>(draft.linkedTripId);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [tags, setTags] = useState<string[]>(draft.tags || []);
  const [tagInput, setTagInput] = useState("");

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

  const normalizedTitle = title.trim();
  const isValid = normalizedTitle && country;

  const toggleFocus = (focus: StoryFocus) => {
    setStoryFocuses((prev) =>
      prev.includes(focus) ? prev.filter((f) => f !== focus) : [...prev, focus]
    );
  };

  const toggleTravelStyle = (styleId: TravelStyleId) => {
    setTravelStyles((prev) =>
      prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]
    );
  };

  const normalizeTag = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/^#/, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const addTag = (raw: string) => {
    const next = normalizeTag(raw);
    if (!next) return;
    setTags((prev) => (prev.includes(next) ? prev : [...prev, next]));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleContinue = () => {
    if (isValid) {
      onComplete({
        title: normalizedTitle,
        storyFocuses,
        travelStyles,
        country,
        city,
        linkedTripId,
        tags,
      });
    }
  };

  return (
    <div className="space-y-6 pb-40">
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

      {/* Story Type (formerly Story Focus) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Story Type</Label>
        <p className="text-sm text-muted-foreground">
          Choose one (optional). Helps readers know what to expect.
        </p>
        <div className="flex flex-wrap gap-2">
          {storyFocusOptions.map((option) => {
            const Icon = storyTypeIconMap[option.icon];
            const selected = storyFocuses.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleFocus(option.value)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                  selected
                    ? "bg-foreground text-background border border-foreground"
                    : "bg-secondary text-foreground border border-transparent hover:bg-secondary/80"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {Icon && <Icon className="h-4 w-4" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Travel Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Travel Style</Label>
        <p className="text-sm text-muted-foreground">
          Pick the travel styles that match this story.
        </p>
        <div className="flex flex-wrap gap-2">
          {travelStyleOptions.map((style) => {
            const Icon = travelStyleIconMap[style.icon];
            const selected = travelStyles.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleTravelStyle(style.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                  selected
                    ? "bg-foreground text-background border border-foreground"
                    : "bg-secondary text-foreground border border-transparent hover:bg-secondary/80"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {Icon && <Icon className="h-4 w-4" />}
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add a Tag (optional) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Add a Tag (optional)</Label>
        <p className="text-sm text-muted-foreground">
          For extra keywords like destinations, experiences, etc.
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="gap-1 pr-1">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded px-1 hover:bg-muted"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Add a tag (e.g., vietnam, itinerary)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
            Add
          </Button>
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
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50">
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
