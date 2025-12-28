import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Image,
  Check,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { PillChip } from "@/components/shared/PillChip";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Visibility" },
  { id: 2, title: "Basics" },
  { id: 3, title: "Details" },
  { id: 4, title: "Review" },
];

const categories = [
  "Nature & Outdoor",
  "City & Urban",
  "Cross Border",
  "Beach",
  "Culture",
  "Food",
  "Adventure",
];

export default function CreateTrip() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    visibility: "public" as "public" | "private",
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    slots: 8,
    budgetMin: 500,
    budgetMax: 1500,
    tags: [] as string[],
    description: "",
    requirements: "",
    images: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handlePublish = () => {
    console.log("Publishing trip:", formData);
    navigate("/my-trips");
  };

  return (
    <AppLayout hideBottomNav>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Create a Trip</h1>

        {/* Progress */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-12 mx-1",
                    currentStep > step.id ? "bg-primary" : "bg-secondary"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Visibility */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Who can see this trip?
            </h2>
            <div className="grid gap-3">
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  formData.visibility === "public"
                    ? "border-primary bg-accent/30"
                    : "border-border/50 hover:border-primary/50"
                )}
                onClick={() => updateField("visibility", "public")}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Public</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Anyone can discover and request to join your trip
                    </p>
                  </div>
                </div>
              </Card>
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  formData.visibility === "private"
                    ? "border-primary bg-accent/30"
                    : "border-border/50 hover:border-primary/50"
                )}
                onClick={() => updateField("visibility", "private")}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Closed Friends
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only people with the link can join
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Basics */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">
              Trip Details
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Trip Title
              </label>
              <Input
                placeholder="e.g., Langkawi Island Adventure"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={(e) => updateField("destination", e.target.value)}
                  className="rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Max Slots
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.slots}
                    onChange={(e) =>
                      updateField("slots", parseInt(e.target.value))
                    }
                    className="rounded-xl pl-10"
                    min={2}
                    max={20}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Budget (RM)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., 500-1500"
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((tag) => (
                  <PillChip
                    key={tag}
                    label={tag}
                    selected={formData.tags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">
              Additional Details
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                placeholder="Tell travelers what to expect..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="rounded-xl min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Requirements
              </label>
              <Textarea
                placeholder="Any specific requirements? (one per line)"
                value={formData.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cover Images
              </label>
              <Card className="p-8 border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 rounded-xl bg-secondary">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click to upload images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">
              Review Your Trip
            </h2>

            <Card className="p-4 border-border/50 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium text-foreground">
                  {formData.title || "Untitled Trip"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium text-foreground">
                  {formData.destination || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dates</p>
                <p className="font-medium text-foreground">
                  {formData.startDate && formData.endDate
                    ? `${formData.startDate} - ${formData.endDate}`
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="font-medium text-foreground capitalize">
                  {formData.visibility}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag) => (
                      <PillChip key={tag} label={tag} size="sm" />
                    ))
                  ) : (
                    <span className="text-muted-foreground">None selected</span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex-1 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {currentStep < 4 ? (
            <Button onClick={nextStep} className="flex-1 rounded-xl">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handlePublish} className="flex-1 rounded-xl">
              Publish Trip
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}