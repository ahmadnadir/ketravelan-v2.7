import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

export default function Feedback() {
  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">We'd love to hear your thoughts</p>
        </div>

        <div className="space-y-4">
          <Textarea 
            placeholder="Share your feedback, suggestions, or report any issues..."
            className="min-h-[150px]"
          />
          <Button className="w-full">Submit Feedback</Button>
        </div>
      </div>
    </AppLayout>
  );
}
