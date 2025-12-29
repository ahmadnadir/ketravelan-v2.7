import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AttachmentSheet } from "./AttachmentSheet";

interface ChatComposerProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export function ChatComposer({ onSend, placeholder = "Type a message..." }: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  const handleAttachment = (type: "image" | "document" | "location") => {
    // Handle attachment based on type
    console.log("Attachment selected:", type);
    setAttachmentOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-[68px] left-0 right-0 p-3 sm:p-4 glass border-t border-border/50 z-40">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setAttachmentOpen(true)}
            >
              <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-full bg-secondary border-0 h-9 sm:h-10 text-sm sm:text-base"
            />
            <Button
              size="icon"
              className="shrink-0 rounded-full h-9 w-9 sm:h-10 sm:w-10"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AttachmentSheet
        open={attachmentOpen}
        onOpenChange={setAttachmentOpen}
        onSelect={handleAttachment}
      />
    </>
  );
}
