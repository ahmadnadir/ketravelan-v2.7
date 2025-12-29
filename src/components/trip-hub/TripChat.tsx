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
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)] relative">
      {/* Messages - add bottom padding to account for fixed composer */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 pb-24 sm:pb-28">
        {mockMessages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          const isSystem = msg.type === "system";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[10px] sm:text-xs text-muted-foreground bg-secondary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={cn("flex flex-col gap-0.5 sm:gap-1", isOwn && "items-end")}
            >
              {!isOwn && (
                <span className="text-[10px] sm:text-xs text-muted-foreground ml-2 sm:ml-3">
                  {msg.senderName}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                )}
              >
                <p className="text-xs sm:text-sm">{msg.content}</p>
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs text-muted-foreground",
                isOwn ? "mr-1" : "ml-2 sm:ml-3"
              )}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Composer - Fixed to bottom, positioned above BottomNav */}
      <div className="fixed bottom-16 sm:bottom-[68px] left-0 right-0 p-3 sm:p-4 glass border-t border-border/50 z-40">
        <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
              <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
              <Image className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder="Type a message..."
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
    </div>
  );
}
