import { useState } from "react";
import { Send, Mail, MessageCircle, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
  lastReminderSent?: Date;
  onSend: (message: string) => void;
}

export function SendReminderModal({
  open,
  onOpenChange,
  recipientName,
  amount,
  tripName,
  lastReminderSent,
  onSend,
}: SendReminderModalProps) {
  const defaultMessage = `Hey 👋 Just a reminder to settle RM${amount} for our ${tripName} trip. Thanks!`;
  const [message, setMessage] = useState(defaultMessage);

  const handleSend = () => {
    onSend(message);
    toast({
      title: "Reminder sent",
      description: `Payment reminder sent to ${recipientName} via notification, chat, and email`,
    });
    onOpenChange(false);
    setMessage(defaultMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Send Payment Reminder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              Remind <span className="font-medium text-foreground">{recipientName}</span> to pay{" "}
              <span className="font-medium text-foreground">RM {amount}</span>
            </p>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your reminder message..."
            className="min-h-[100px] resize-none rounded-xl"
          />

          {/* Multi-channel notification info */}
          <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/50">
            <div className="flex gap-1.5 mt-0.5">
              <Bell className="h-3.5 w-3.5 text-muted-foreground" />
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be sent via in-app notification, chat, and email.
            </p>
          </div>

          {/* Last reminder sent timestamp */}
          {lastReminderSent && (
            <p className="text-xs text-muted-foreground/70 text-center">
              Last reminder sent {formatDistanceToNow(lastReminderSent)} ago
            </p>
          )}

          <Button className="w-full h-12 rounded-xl" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
