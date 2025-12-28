import { useState } from "react";
import { Send, Image, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockMessages } from "@/data/mockData";

export function TripChat() {
  const [message, setMessage] = useState("");
  const currentUserId = "1"; // Mock current user

  const handleSend = () => {
    if (!message.trim()) return;
    // Would send message here
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {mockMessages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          const isSystem = msg.type === "system";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={cn("flex flex-col gap-1", isOwn && "items-end")}
            >
              {!isOwn && (
                <span className="text-xs text-muted-foreground ml-3">
                  {msg.senderName}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                )}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              <span className={cn(
                "text-xs text-muted-foreground",
                isOwn ? "mr-1" : "ml-3"
              )}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 p-4 glass border-t border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Image className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full bg-secondary border-0"
          />
          <Button
            size="icon"
            className="shrink-0 rounded-full"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}