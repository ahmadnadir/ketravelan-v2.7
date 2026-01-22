import { useMemo, useState, useEffect } from "react";
import { MapPin, Link2, ChevronRight } from "lucide-react";
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
  StoryFocus,
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

export function StorySetupStep({ draft, onComplete }: StorySetupStepProps) {
  const [title, setTitle] = useState(draft.title);
  const [storyFocuses, setStoryFocuses] = useState<StoryFocus[]>(draft.storyFocuses || []);
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

  const suggestedTags = useMemo(() => {
    const suggestions = new Set<string>();

    // Location
    if (country) suggestions.add(normalizeTag(country));
    if (city) suggestions.add(normalizeTag(city));

    // Focuses
    storyFocuses.forEach((f) => suggestions.add(normalizeTag(f)));

    // Title keywords (lightweight)
    normalizedTitle
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w) => w.length >= 5)
      .slice(0, 8)
      .forEach((w) => suggestions.add(normalizeTag(w)));

    // Remove already-selected tags
    tags.forEach((t) => suggestions.delete(t));

    return Array.from(suggestions).filter(Boolean).slice(0, 10);
  }, [country, city, normalizedTitle, storyFocuses, tags]);

  const handleContinue = () => {
    if (isValid) {
      onComplete({
        title: normalizedTitle,
        storyFocuses,
        country,
        city,
        linkedTripId,
        tags,
      });
    }
  };

  return (
    <div className="p-4 space-y-6 pb-40">
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

      {/* Story Focus (Optional) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Story Focus <span className="text-muted-foreground">(optional)</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Help readers understand your story (optional). You can skip this or choose more than one.
        </p>
        <div className="flex flex-wrap gap-2">
          {storyFocusOptions.map((option) => {
            const selected = storyFocuses.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleFocus(option.value)}
                className={
                  selected
                    ? "rounded-full px-3 py-1.5 text-sm border border-primary bg-primary/5 text-foreground"
                    : "rounded-full px-3 py-1.5 text-sm border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tags</Label>
        <p className="text-sm text-muted-foreground">
          Tags help others discover your story. Add or edit anytime.
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
            placeholder="Add a tag (e.g., budget, vietnam)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
            Add
          </Button>
        </div>

        {suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addTag(t)}
                  className="rounded-full px-3 py-1.5 text-sm border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>
        )}
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
