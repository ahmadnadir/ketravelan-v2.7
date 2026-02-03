import { useState, useEffect, useRef } from "react";
import { MapPin, Link2, ChevronRight, Check, X, Plus } from "lucide-react";
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
  countries,
  storyTitleExamples,
  storyFocusOptions,
  travelStyleOptions,
  StoryFocus,
  TravelStyleId,
} from "@/data/communityMockData";

interface StorySetupStepProps {
  draft: StoryDraft;
  onComplete: (data: Partial<StoryDraft>) => void;
}

// Mock trips data
const mockUpcomingTrips = [
  { id: "trip-upcoming-1", title: "Bali Getaway", destination: "Indonesia", startsIn: "3 days" },
];

const mockPastTrips = [
  { id: "trip-1", title: "Vietnam Adventure", destination: "Vietnam" },
  { id: "trip-2", title: "Japan Solo Trip", destination: "Japan" },
];

export function StorySetupStep({ draft, onComplete }: StorySetupStepProps) {
  const [title, setTitle] = useState(draft.title);
  const [storyFocuses, setStoryFocuses] = useState<StoryFocus[]>(draft.storyFocuses || []);
  const [travelStyles, setTravelStyles] = useState<TravelStyleId[]>((draft.travelStyles || []) as TravelStyleId[]);
  const [customStoryTypes, setCustomStoryTypes] = useState<string[]>(draft.customStoryTypes || []);
  const [customTravelStyles, setCustomTravelStyles] = useState<string[]>(draft.customTravelStyles || []);
  const [country, setCountry] = useState(draft.country);
  const [city, setCity] = useState(draft.city);
  const [linkedTripId, setLinkedTripId] = useState<string | null>(draft.linkedTripId);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Custom input states
  const [showCustomStoryInput, setShowCustomStoryInput] = useState(false);
  const [showCustomStyleInput, setShowCustomStyleInput] = useState(false);
  const [customStoryInput, setCustomStoryInput] = useState("");
  const [customStyleInput, setCustomStyleInput] = useState("");
  const customStoryInputRef = useRef<HTMLInputElement>(null);
  const customStyleInputRef = useRef<HTMLInputElement>(null);

  // Trip linking state
  const [wantToLinkTrip, setWantToLinkTrip] = useState<boolean | null>(
    draft.linkedTripId ? true : null
  );

  // Rotate placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % storyTitleExamples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Focus custom inputs when shown
  useEffect(() => {
    if (showCustomStoryInput && customStoryInputRef.current) {
      customStoryInputRef.current.focus();
    }
  }, [showCustomStoryInput]);

  useEffect(() => {
    if (showCustomStyleInput && customStyleInputRef.current) {
      customStyleInputRef.current.focus();
    }
  }, [showCustomStyleInput]);

  const handleLinkTrip = (tripId: string) => {
    if (tripId === linkedTripId) {
      setLinkedTripId(null);
    } else {
      setLinkedTripId(tripId);
      // Auto-fill destination from trip
      const trip = [...mockUpcomingTrips, ...mockPastTrips].find((t) => t.id === tripId);
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

  const handleWantToLinkTrip = (value: boolean) => {
    setWantToLinkTrip(value);
    if (!value) {
      setLinkedTripId(null);
    }
  };

  const normalizedTitle = title.trim();
  const isValid = Boolean(normalizedTitle);

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

  // Custom story type handlers
  const handleAddCustomStoryType = () => {
    const trimmed = customStoryInput.trim();
    if (trimmed && !customStoryTypes.includes(trimmed)) {
      setCustomStoryTypes((prev) => [...prev, trimmed]);
      // Auto-select the custom type (store as string in storyFocuses for now)
      setStoryFocuses((prev) => [...prev, trimmed as StoryFocus]);
    }
    setCustomStoryInput("");
    setShowCustomStoryInput(false);
  };

  const handleRemoveCustomStoryType = (type: string) => {
    setCustomStoryTypes((prev) => prev.filter((t) => t !== type));
    setStoryFocuses((prev) => prev.filter((f) => f !== type));
  };

  const toggleCustomStoryType = (type: string) => {
    setStoryFocuses((prev) =>
      prev.includes(type as StoryFocus)
        ? prev.filter((f) => f !== type)
        : [...prev, type as StoryFocus]
    );
  };

  // Custom travel style handlers
  const handleAddCustomTravelStyle = () => {
    const trimmed = customStyleInput.trim();
    if (trimmed && !customTravelStyles.includes(trimmed)) {
      setCustomTravelStyles((prev) => [...prev, trimmed]);
      // Auto-select the custom style
      setTravelStyles((prev) => [...prev, trimmed as TravelStyleId]);
    }
    setCustomStyleInput("");
    setShowCustomStyleInput(false);
  };

  const handleRemoveCustomTravelStyle = (style: string) => {
    setCustomTravelStyles((prev) => prev.filter((s) => s !== style));
    setTravelStyles((prev) => prev.filter((s) => s !== style));
  };

  const toggleCustomTravelStyle = (style: string) => {
    setTravelStyles((prev) =>
      prev.includes(style as TravelStyleId)
        ? prev.filter((s) => s !== style)
        : [...prev, style as TravelStyleId]
    );
  };

  const handleContinue = () => {
    if (isValid) {
      onComplete({
        title: normalizedTitle,
        storyFocuses,
        travelStyles,
        customStoryTypes,
        customTravelStyles,
        country,
        city,
        linkedTripId,
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

      {/* Story Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Story Type</Label>
        <p className="text-sm text-muted-foreground">
          Choose one or add your own (optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {storyFocusOptions.map((option) => {
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
                <span>{option.icon}</span>
                {option.label}
              </button>
            );
          })}

          {/* Custom story types */}
          {customStoryTypes.map((type) => {
            const selected = storyFocuses.includes(type as StoryFocus);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleCustomStoryType(type)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                  selected
                    ? "bg-foreground text-background border border-foreground"
                    : "bg-secondary text-foreground border border-transparent hover:bg-secondary/80"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {type}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustomStoryType(type);
                  }}
                  className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-background/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            );
          })}

          {/* Add custom input or button */}
          {showCustomStoryInput ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5">
              <Input
                ref={customStoryInputRef}
                value={customStoryInput}
                onChange={(e) => setCustomStoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomStoryType();
                  } else if (e.key === "Escape") {
                    setShowCustomStoryInput(false);
                    setCustomStoryInput("");
                  }
                }}
                onBlur={() => {
                  if (customStoryInput.trim()) {
                    handleAddCustomStoryType();
                  } else {
                    setShowCustomStoryInput(false);
                  }
                }}
                placeholder="Type here..."
                className="h-6 w-24 border-0 p-0 text-sm focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleAddCustomStoryType}
              >
                Add
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomStoryInput(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add custom
            </button>
          )}
        </div>
      </div>

      {/* Travel Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Travel Style</Label>
        <p className="text-sm text-muted-foreground">
          Pick the styles that match this story or add your own
        </p>
        <div className="flex flex-wrap gap-2">
          {travelStyleOptions.map((style) => {
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
                <span>{style.icon}</span>
                {style.label}
              </button>
            );
          })}

          {/* Custom travel styles */}
          {customTravelStyles.map((style) => {
            const selected = travelStyles.includes(style as TravelStyleId);
            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleCustomTravelStyle(style)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                  selected
                    ? "bg-foreground text-background border border-foreground"
                    : "bg-secondary text-foreground border border-transparent hover:bg-secondary/80"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {style}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustomTravelStyle(style);
                  }}
                  className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-background/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            );
          })}

          {/* Add custom input or button */}
          {showCustomStyleInput ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5">
              <Input
                ref={customStyleInputRef}
                value={customStyleInput}
                onChange={(e) => setCustomStyleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTravelStyle();
                  } else if (e.key === "Escape") {
                    setShowCustomStyleInput(false);
                    setCustomStyleInput("");
                  }
                }}
                onBlur={() => {
                  if (customStyleInput.trim()) {
                    handleAddCustomTravelStyle();
                  } else {
                    setShowCustomStyleInput(false);
                  }
                }}
                placeholder="Type here..."
                className="h-6 w-24 border-0 p-0 text-sm focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleAddCustomTravelStyle}
              >
                Add
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomStyleInput(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add custom
            </button>
          )}
        </div>
      </div>

      {/* Destination (Optional) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Where did this happen?
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

      {/* Trip Linking - Conditional */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Do you want to link this story to a trip?
        </Label>

        {/* Yes/No buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={wantToLinkTrip === true ? "default" : "outline"}
            size="sm"
            onClick={() => handleWantToLinkTrip(true)}
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={wantToLinkTrip === false ? "default" : "outline"}
            size="sm"
            onClick={() => handleWantToLinkTrip(false)}
            className="flex-1"
          >
            No
          </Button>
        </div>

        {/* Trip cards - only show if Yes */}
        {wantToLinkTrip === true && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Upcoming Trips */}
            {mockUpcomingTrips.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Upcoming Trips
                </p>
                {mockUpcomingTrips.map((trip) => (
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
                        <p className="text-xs text-muted-foreground">
                          {trip.destination} • Starts in {trip.startsIn}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border ${
                          linkedTripId === trip.id
                            ? "border-primary bg-primary text-white flex items-center justify-center"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {linkedTripId === trip.id && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Past Trips */}
            {mockPastTrips.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Past Trips
                </p>
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
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
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
