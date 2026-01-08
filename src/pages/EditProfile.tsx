import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  User,
  MapPin,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  Facebook,
  Twitter,
  Plus,
  X,
  Check,
  Settings,
  Coins,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ImageCropModal } from "@/components/profile/ImageCropModal";
import { useAuth } from "@/contexts/AuthContext";
import { CurrencyCode, currencies } from "@/lib/currencyUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { travelStyles, getTravelStyleEmoji } from "@/data/travelStyles";
import { PillChip } from "@/components/shared/PillChip";

// TikTok icon component
const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Social platform options - includes TikTok from onboarding
const socialPlatforms = [
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "instagram.com/username" },
  { id: "tiktok", label: "TikTok", icon: TikTok, placeholder: "tiktok.com/@username" },
  { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "youtube.com/@channel" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/username" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "facebook.com/username" },
  { id: "twitter", label: "X (Twitter)", icon: Twitter, placeholder: "x.com/username" },
  { id: "website", label: "Website", icon: Globe, placeholder: "yourwebsite.com" },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setHomeCurrency } = useAuth();

  // Home currency state
  const [selectedHomeCurrency, setSelectedHomeCurrency] = useState<CurrencyCode>(
    user?.homeCurrency || "MYR"
  );

  // Form state - initialized with mock current user data
  const [formData, setFormData] = useState({
    name: "Ahmad Razak",
    location: "Kuala Lumpur, Malaysia",
    bio: "Passionate traveler who loves exploring new cultures and cuisines. Always looking for the next adventure! 🌍✈️",
  });

  // Store style IDs (matching TravelStyleGrid)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "adventure",
    "budget",
    "nature",
    "food",
  ]);

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    instagram: "https://instagram.com/ahmadrazak",
    youtube: "https://youtube.com/@ahmadtravels",
    linkedin: "https://linkedin.com/in/ahmadrazak",
  });

  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem("userProfileImage") || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200";
  });

  const [isSaving, setIsSaving] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTravelStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const removeSocialLink = (platform: string) => {
    setSocialLinks((prev) => {
      const updated = { ...prev };
      delete updated[platform];
      return updated;
    });
  };

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageToCrop(result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl);
    localStorage.setItem("userProfileImage", croppedImageUrl);
    toast({
      title: "Photo updated",
      description: "Your profile photo has been cropped and saved.",
    });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Save home currency to context
    if (selectedHomeCurrency !== user?.homeCurrency) {
      setHomeCurrency(selectedHomeCurrency);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });

    setIsSaving(false);
    navigate("/profile");
  };

  // Get platforms that haven't been added yet
  const availablePlatformsToAdd = socialPlatforms.filter(
    (p) => !Object.keys(socialLinks).includes(p.id)
  );

  const addSocialLink = (platformId: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platformId]: "",
    }));
  };

  return (
    <AppLayout>
      {/* Custom Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate(-1)}>
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-secondary flex items-center justify-center">
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </div>
            </button>
            <h1 className="font-semibold text-foreground text-sm sm:text-base">Edit Profile</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="rounded-full text-xs sm:text-sm"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profileImage} alt="Profile" />
              <AvatarFallback className="text-xl sm:text-2xl font-semibold">
                {formData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleImageChange}
              className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
          <button
            onClick={handleImageChange}
            className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary font-medium"
          >
            Change Photo
          </button>
        </div>

        {/* Basic Info */}
        <Card className="p-3 sm:p-4 border-border/50 space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-base flex items-center gap-2">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            Basic Information
          </h3>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Your name"
              className="h-10 sm:h-11 rounded-xl text-sm"
              maxLength={50}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
                className="h-10 sm:h-11 rounded-xl pl-9 sm:pl-10 text-sm"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="bio" className="text-xs sm:text-sm">About Me</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell others about yourself..."
              className="rounded-xl min-h-[80px] sm:min-h-[100px] resize-none text-sm"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/200
            </p>
          </div>
        </Card>

        {/* Travel Styles - Using PillChip for consistent styling */}
        <Card className="p-3 sm:p-4 border-border/50 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Travel Style</h3>
            <span className="text-xs text-muted-foreground">
              {selectedStyles.length} selected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select styles that match your travel preferences
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {travelStyles.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => toggleTravelStyle(style.id)}
                  className="transition-all"
                >
                  <PillChip
                    label={style.label}
                    icon={style.emoji}
                    size="sm"
                    className={isSelected 
                      ? "bg-primary/10 border-primary text-primary ring-1 ring-primary/30" 
                      : "opacity-60 hover:opacity-100"
                    }
                  />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Preferences - Home Currency */}
        <Card className="p-3 sm:p-4 border-border/50 space-y-3">
          <h3 className="font-semibold text-foreground text-sm sm:text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Preferences
          </h3>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm flex items-center gap-2">
              <Coins className="h-3.5 w-3.5 text-muted-foreground" />
              Home Currency
            </Label>
            <Select 
              value={selectedHomeCurrency} 
              onValueChange={(val) => setSelectedHomeCurrency(val as CurrencyCode)}
            >
              <SelectTrigger className="h-10 sm:h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} – {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Used to display expense totals and settlements
            </p>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-3 sm:p-4 border-border/50 space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Social Links</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connect your social profiles
          </p>

          {/* Existing links */}
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(socialLinks).map(([platform, url]) => {
              const platformInfo = socialPlatforms.find((p) => p.id === platform);
              if (!platformInfo) return null;
              const Icon = platformInfo.icon;
              return (
                <div key={platform} className="flex items-center gap-1.5 sm:gap-2">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <Input
                    value={url}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    placeholder={platformInfo.placeholder}
                    className="h-8 sm:h-10 rounded-lg sm:rounded-xl flex-1 text-xs sm:text-sm"
                  />
                  <button
                    onClick={() => removeSocialLink(platform)}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add new link */}
          {availablePlatformsToAdd.length > 0 && (
            <div className="pt-1 sm:pt-2">
              <p className="text-xs text-muted-foreground mb-1.5 sm:mb-2">Add more:</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availablePlatformsToAdd.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => addSocialLink(platform.id)}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{platform.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        open={cropModalOpen}
        onOpenChange={setCropModalOpen}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </AppLayout>
  );
}
