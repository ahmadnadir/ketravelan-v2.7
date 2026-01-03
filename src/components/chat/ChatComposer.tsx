import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AttachmentSheet } from "./AttachmentSheet";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

interface ChatComposerProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export function ChatComposer({ onSend, placeholder = "Type a message..." }: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const keyboardHeight = useKeyboardHeight();

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

  // When keyboard is open, position above keyboard; otherwise use default nav-aware position
  const bottomStyle = keyboardHeight > 0 
    ? { bottom: `${keyboardHeight}px` } 
    : undefined;

  return (
    <>
      <div 
        className={`fixed left-0 right-0 glass z-40 transition-[bottom] duration-150 ${keyboardHeight === 0 ? 'bottom-above-nav' : ''}`}
        style={bottomStyle}
      >
        {/* Input container with elevated padding */}
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5">
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
                className="flex-1 rounded-full bg-secondary border-0 h-9 sm:h-10 text-base"
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
        
        {/* Subtle divider line - separates from bottom navbar */}
        <div className="h-px w-full bg-border/60" />
      </div>

      <AttachmentSheet
        open={attachmentOpen}
        onOpenChange={setAttachmentOpen}
        onSelect={handleAttachment}
      />
    </>
  );
}
