import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CurrencyCard, currencyData } from "@/components/onboarding/CurrencyCard";
import { TravelStyleGrid } from "@/components/onboarding/TravelStyleGrid";
import { ImageCropModal } from "@/components/profile/ImageCropModal";
import { useAuth } from "@/contexts/AuthContext";
import { CurrencyCode } from "@/lib/currencyUtils";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const navigate = useNavigate();
  const { setHomeCurrency, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Profile
  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  // Step 2: Currency & Location
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("MYR");
  const [location, setLocation] = useState("");

  // Step 3: Travel Styles
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Load saved avatar on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("ketravelan-avatar");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingImage(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
    localStorage.setItem("ketravelan-avatar", croppedDataUrl);
    setCropModalOpen(false);
    setPendingImage(null);
  };

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    // Save all data
    setHomeCurrency(selectedCurrency);
    localStorage.setItem("ketravelan-onboarded", "true");
    localStorage.setItem("ketravelan-profile-name", name);
    localStorage.setItem("ketravelan-location", location);
    localStorage.setItem("ketravelan-travel-styles", JSON.stringify(selectedStyles));
    
    navigate("/explore");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return true; // Currency has default
      case 3:
        return true; // Styles are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container max-w-lg mx-auto flex h-16 items-center px-4">
          {currentStep > 1 && currentStep < 4 ? (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex-1" />
          {currentStep < 4 && (
            <span className="text-sm text-muted-foreground">
              {currentStep} of {TOTAL_STEPS - 1}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 container max-w-lg mx-auto px-4 py-6 flex flex-col">
        {/* Step 1: Welcome + Avatar */}
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Let's set up your profile!</h1>
              <p className="text-muted-foreground">
                This helps travel buddies get to know you
              </p>
            </div>

            {/* Avatar Picker */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Avatar
                  className="h-28 w-28 border-4 border-background shadow-lg cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-muted">
                    {name ? getInitials(name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="flex-1" />
          </div>
        )}

        {/* Step 2: Currency & Location */}
        {currentStep === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Where are you based?</h1>
              <p className="text-muted-foreground">
                We'll show prices and settlements in your currency
              </p>
            </div>

            {/* Currency Cards Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currencyData.map((currency) => (
                <CurrencyCard
                  key={currency.code}
                  {...currency}
                  isSelected={selectedCurrency === currency.code}
                  onSelect={() => setSelectedCurrency(currency.code)}
                />
              ))}
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location (optional)
              </label>
              <Input
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="flex-1" />
          </div>
        )}

        {/* Step 3: Travel Styles */}
        {currentStep === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">What's your travel vibe?</h1>
              <p className="text-muted-foreground">
                Pick styles that match how you like to travel
              </p>
            </div>

            <TravelStyleGrid
              selectedStyles={selectedStyles}
              onToggle={handleStyleToggle}
            />

            {selectedStyles.length > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {selectedStyles.length} selected
              </p>
            )}

            <div className="flex-1" />
          </div>
        )}

        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            {/* Celebration */}
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-warning" />
              <div className="absolute -bottom-1 -left-3 h-3 w-3 rounded-full bg-info" />
              <div className="absolute top-1/2 -right-4 h-2 w-2 rounded-full bg-success" />
            </div>

            <h1 className="text-2xl font-bold mb-2">You're all set! 🎉</h1>
            <p className="text-muted-foreground text-center mb-8">
              Your profile is ready to go
            </p>

            {/* Summary Card */}
            <div className="w-full bg-card rounded-2xl border border-border p-5 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 border-background shadow">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{name}</p>
                  {location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">
                  {currencyData.find((c) => c.code === selectedCurrency)?.flag}
                </span>
                <span className="font-medium">{selectedCurrency}</span>
                <span className="text-muted-foreground">• Home Currency</span>
              </div>

              {selectedStyles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedStyles.slice(0, 5).map((styleId) => {
                    const style = [
                      { id: "adventure", label: "Adventure", emoji: "🏔️" },
                      { id: "budget", label: "Budget-friendly", emoji: "💰" },
                      { id: "nature", label: "Nature", emoji: "🌿" },
                      { id: "food", label: "Food", emoji: "🍜" },
                      { id: "city", label: "City", emoji: "🏙️" },
                      { id: "culture", label: "Culture", emoji: "🏛️" },
                      { id: "photography", label: "Photo", emoji: "📸" },
                      { id: "hiking", label: "Hiking", emoji: "🥾" },
                      { id: "wildlife", label: "Wildlife", emoji: "🦁" },
                      { id: "beach", label: "Beach", emoji: "🏖️" },
                      { id: "luxury", label: "Luxury", emoji: "✨" },
                      { id: "backpacking", label: "Backpacking", emoji: "🎒" },
                      { id: "solo", label: "Solo", emoji: "🧭" },
                      { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
                      { id: "romantic", label: "Romantic", emoji: "💕" },
                    ].find((s) => s.id === styleId);
                    if (!style) return null;
                    return (
                      <span
                        key={styleId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted rounded-full text-xs font-medium"
                      >
                        {style.emoji} {style.label}
                      </span>
                    );
                  })}
                  {selectedStyles.length > 5 && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                      +{selectedStyles.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="w-full space-y-3">
              <Button
                onClick={handleComplete}
                className="w-full h-12 text-base font-medium rounded-xl"
              >
                Start Exploring
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleComplete();
                  navigate("/create");
                }}
                className="w-full h-12 text-base font-medium rounded-xl"
              >
                Create a Trip
              </Button>
            </div>
          </div>
        )}

        {/* Progress Dots + Continue Button */}
        {currentStep < 4 && (
          <div className="mt-auto pt-6">
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    step === currentStep
                      ? "w-6 bg-primary"
                      : step < currentStep
                      ? "w-2 bg-primary"
                      : "w-2 bg-muted"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-12 text-base font-medium rounded-xl"
            >
              Continue
            </Button>

            {currentStep === 1 && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Photo is optional, you can add it later
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        open={cropModalOpen}
        onOpenChange={setCropModalOpen}
        imageSrc={pendingImage}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
