import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DiscussionTopic, discussionTopicLabels, countries } from "@/data/communityMockData";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AskQuestionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const topics: DiscussionTopic[] = [
  "budget",
  "transport",
  "visa",
  "safety",
  "food",
  "accommodation",
  "activities",
  "general",
];

export function AskQuestionDrawer({ open, onOpenChange }: AskQuestionDrawerProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("Malaysia");
  const [selectedTopic, setSelectedTopic] = useState<DiscussionTopic | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Question required",
        description: "Please enter your question.",
        variant: "destructive",
      });
      return;
    }

    // Here you would submit to backend
    toast({
      title: "Question posted!",
      description: "The community will help you out soon.",
    });

    // Reset form
    setTitle("");
    setDetails("");
    setSelectedTopic(null);
    setIsAnonymous(false);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Ask the Community</DrawerTitle>
          <DrawerDescription>
            No such thing as a silly question — the community's here to help.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-4 overflow-y-auto">
          {/* Question title */}
          <div className="space-y-2">
            <Label htmlFor="question-title">Your question *</Label>
            <Input
              id="question-title"
              placeholder="e.g., Best way to get from KLIA to Langkawi?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="question-details">More details (optional)</Label>
            <Textarea
              id="question-details"
              placeholder="Add any context that might help others answer your question..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.name} value={country.name}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic selection */}
          <div className="space-y-2">
            <Label>Topic</Label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    selectedTopic === topic
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {discussionTopicLabels[topic]}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="anonymous-toggle" className="text-sm font-medium">
                Post anonymously
              </Label>
              <p className="text-xs text-muted-foreground">
                Your name won't be shown with this question
              </p>
            </div>
            <Switch
              id="anonymous-toggle"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} className="w-full">
            Post Question
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
