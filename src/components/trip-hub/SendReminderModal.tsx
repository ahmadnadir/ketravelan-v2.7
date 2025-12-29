import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface SendReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  amount: number;
  tripName: string;
  onSend: (message: string) => void;
}

export function SendReminderModal({
  open,
  onOpenChange,
  recipientName,
  amount,
  tripName,
  onSend,
}: SendReminderModalProps) {
  const defaultMessage = `Hey 👋 Just a friendly reminder to settle RM${amount} for our ${tripName} trip. Thanks!`;
  const [message, setMessage] = useState(defaultMessage);

  const handleSend = () => {
    onSend(message);
    toast({
      title: "Reminder sent",
      description: `Payment reminder sent to ${recipientName}`,
    });
    onOpenChange(false);
    setMessage(defaultMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Payment Reminder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Remind <span className="font-medium text-foreground">{recipientName}</span> to pay{" "}
            <span className="font-medium text-foreground">RM {amount}</span>
          </p>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your reminder message..."
            className="min-h-[100px] resize-none"
          />

          <Button className="w-full" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
