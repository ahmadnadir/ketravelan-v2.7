import { useState } from "react";
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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Available travel styles
const availableTravelStyles = [
  "Adventure",
  "Budget-friendly",
  "Nature",
  "Food",
  "City & Urban",
  "Culture",
  "Photography",
  "Hiking",
  "Wildlife",
  "Beach",
  "Luxury",
  "Backpacking",
  "Solo",
  "Family",
  "Romantic",
];

// Social platform options
const socialPlatforms = [
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "instagram.com/username" },
  { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "youtube.com/@channel" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/username" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "facebook.com/username" },
  { id: "twitter", label: "X (Twitter)", icon: Twitter, placeholder: "x.com/username" },
  { id: "website", label: "Website", icon: Globe, placeholder: "yourwebsite.com" },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state - initialized with mock current user data
  const [formData, setFormData] = useState({
    name: "Ahmad Razak",
    location: "Kuala Lumpur, Malaysia",
    bio: "Passionate traveler who loves exploring new cultures and cuisines. Always looking for the next adventure! 🌍✈️",
    budgetMin: "500",
    budgetMax: "2000",
  });

  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "Adventure",
    "Budget-friendly",
    "Nature",
    "Food",
  ]);

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    instagram: "https://instagram.com/ahmadrazak",
    youtube: "https://youtube.com/@ahmadtravels",
    linkedin: "https://linkedin.com/in/ahmadrazak",
  });

  const [profileImage, setProfileImage] = useState<string>(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
  );

  const [isSaving, setIsSaving] = useState(false);

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
    // In a real app, this would open a file picker
    toast({
      title: "Coming soon",
      description: "Profile photo upload will be available soon.",
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
    <AppLayout hideHeader>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-border/50">
          <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)}>
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </div>
                </button>
                <h1 className="font-semibold text-foreground">Edit Profile</h1>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="rounded-full"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback className="text-2xl font-semibold">
                  {formData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleImageChange}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleImageChange}
              className="mt-3 text-sm text-primary font-medium"
            >
              Change Photo
            </button>
          </div>

          {/* Basic Info */}
          <Card className="p-4 border-border/50 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, Country"
                  className="h-12 rounded-xl pl-10"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell others about yourself..."
                className="rounded-xl min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500
              </p>
            </div>
          </Card>

          {/* Travel Styles */}
          <Card className="p-4 border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Travel Style</h3>
              <span className="text-xs text-muted-foreground">
                {selectedStyles.length} selected
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Select styles that match your travel preferences
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTravelStyles.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleTravelStyle(style)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Budget Range */}
          <Card className="p-4 border-border/50 space-y-4">
            <h3 className="font-semibold text-foreground">Budget Range</h3>
            <p className="text-sm text-muted-foreground">
              Your typical budget per trip (RM)
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="budgetMin" className="text-xs">
                  Minimum
                </Label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => handleInputChange("budgetMin", e.target.value)}
                  placeholder="500"
                  className="h-11 rounded-xl"
                  min="0"
                />
              </div>
              <span className="text-muted-foreground mt-5">—</span>
              <div className="flex-1 space-y-1">
                <Label htmlFor="budgetMax" className="text-xs">
                  Maximum
                </Label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                  placeholder="2000"
                  className="h-11 rounded-xl"
                  min="0"
                />
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-4 border-border/50 space-y-4">
            <h3 className="font-semibold text-foreground">Social Links</h3>
            <p className="text-sm text-muted-foreground">
              Connect your social profiles
            </p>

            {/* Existing links */}
            <div className="space-y-3">
              {Object.entries(socialLinks).map(([platform, url]) => {
                const platformInfo = socialPlatforms.find((p) => p.id === platform);
                if (!platformInfo) return null;
                const Icon = platformInfo.icon;
                return (
                  <div key={platform} className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      value={url}
                      onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                      placeholder={platformInfo.placeholder}
                      className="h-10 rounded-xl flex-1"
                    />
                    <button
                      onClick={() => removeSocialLink(platform)}
                      className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 hover:bg-destructive/20 transition-colors"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add new link */}
            {availablePlatformsToAdd.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Add more:</p>
                <div className="flex flex-wrap gap-2">
                  {availablePlatformsToAdd.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => addSocialLink(platform.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors text-sm"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <Icon className="h-3.5 w-3.5" />
                        <span>{platform.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Bottom spacer for fixed elements */}
          <div className="h-4" />
        </div>
      </div>
    </AppLayout>
  );
}
