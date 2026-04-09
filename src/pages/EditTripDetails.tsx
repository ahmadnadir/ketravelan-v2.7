import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TravelStylePills } from "@/components/explore/TravelStylePills";
import { RequirementsSection } from "@/components/create-trip/RequirementsSection";
import { mockTrips, mockMembers } from "@/data/mockData";
import { type TripCategoryId, tripCategories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CURRENT_USER_ID = "1";

function parseDate(dateStr: string): Date | undefined {
  try {
    return parse(dateStr, "MMM d, yyyy", new Date());
  } catch {
    return undefined;
  }
}

function labelToCategory(label: string): TripCategoryId | null {
  const found = tripCategories.find(
    (c) => c.label.toLowerCase() === label.toLowerCase()
  );
  return found ? found.id : null;
}

export default function EditTripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const trip = mockTrips.find((t) => t.id === id);
  const isOrganizer = mockMembers.find(
    (m) => m.id === CURRENT_USER_ID
  )?.role === "Organizer";

  // Redirect non-organizers
  useEffect(() => {
    if (!isOrganizer) navigate(`/trip/${id}/hub`, { replace: true });
  }, [isOrganizer, id, navigate]);

  // Form state
  const [name, setName] = useState(trip?.title ?? "");
  const [country, setCountry] = useState(trip?.destination.split(", ").pop() ?? "");
  const [city, setCity] = useState(trip?.destination.split(", ")[0] ?? "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    trip ? parseDate(trip.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    trip ? parseDate(trip.endDate) : undefined
  );
  const [isPublic, setIsPublic] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(
    trip?.totalSlots?.toString() ?? "10"
  );
  const [travelStyles, setTravelStyles] = useState<TripCategoryId[]>(
    () => (trip?.tags?.map(labelToCategory).filter(Boolean) as TripCategoryId[]) ?? []
  );
  const [description, setDescription] = useState(trip?.description ?? "");
  const [expectations, setExpectations] = useState<string[]>(
    trip?.requirements ?? []
  );

  const [discardOpen, setDiscardOpen] = useState(false);

  // Dirty check
  const isDirty = useMemo(() => {
    if (!trip) return false;
    const origStyles = (trip.tags?.map(labelToCategory).filter(Boolean) as TripCategoryId[]) ?? [];
    return (
      name !== trip.title ||
      description !== trip.description ||
      country !== (trip.destination.split(", ").pop() ?? "") ||
      city !== (trip.destination.split(", ")[0] ?? "") ||
      maxParticipants !== (trip.totalSlots?.toString() ?? "10") ||
      JSON.stringify(travelStyles) !== JSON.stringify(origStyles) ||
      JSON.stringify(expectations) !== JSON.stringify(trip.requirements ?? [])
    );
  }, [name, description, country, city, maxParticipants, travelStyles, expectations, trip]);

  const handleBack = () => {
    if (isDirty) {
      setDiscardOpen(true);
    } else {
      navigate(`/trip/${id}/hub`, { state: { openGroupInfo: true } });
    }
  };

  const handleSave = () => {
    toast.success("Trip details saved successfully!");
    navigate(`/trip/${id}/hub`, { state: { openGroupInfo: true } });
  };

  const handleCoverUpload = () => {
    toast("Upload Cover Photo", { description: "Photo upload coming soon." });
  };

  if (!trip || !isOrganizer) return null;

  const currentMembers = mockMembers.length;

  return (
    <FocusedFlowLayout
      headerContent={
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Edit Trip</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            className="text-sm font-medium"
          >
            Save
          </Button>
        </div>
      }
      footerContent={
        <div className="px-4 py-3 border-t border-border/50">
          <Button
            className="w-full h-12 text-base font-medium rounded-xl"
            disabled={!isDirty}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="pb-6 space-y-6">
        {/* Trip Cover */}
        <div className="relative">
          <div className="h-48 w-full overflow-hidden">
            <img
              src={trip.imageUrl}
              alt={trip.title}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={handleCoverUpload}
            className="absolute bottom-3 right-3 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-md hover:bg-background/90 transition-colors"
          >
            <Camera className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="px-4 space-y-6">
          {/* Basic Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Basic Info</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Trip Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter trip name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Country <span className="text-destructive">*</span>
                </label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Malaysia"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  City <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Langkawi"
                />
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-10",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM d, yyyy") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-10",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM d, yyyy") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </section>

          {/* Trip Type */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Trip Type</h2>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isPublic ? "Public Trip" : "Private Trip"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isPublic
                    ? "Discoverable by anyone on Ketravelan"
                    : "Invite-only, hidden from explore"}
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </section>

          {/* Capacity */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Capacity</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Max Participants
              </label>
              <Input
                type="number"
                min={currentMembers}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Currently {currentMembers} members joined
              </p>
            </div>
          </section>

          {/* Travel Style */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Travel Style</h2>
            <TravelStylePills selected={travelStyles} onChange={setTravelStyles} />
          </section>

          {/* Description */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Description</h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what this trip is about..."
              className="min-h-[120px] resize-none"
            />
          </section>

          {/* What to Expect */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">What to Expect</h2>
            <RequirementsSection
              expectations={expectations}
              onChange={setExpectations}
            />
          </section>
        </div>
      </div>

      {/* Discard Changes Dialog */}
      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(`/trip/${id}/hub`, { state: { openGroupInfo: true } })}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FocusedFlowLayout>
  );
}
