import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { mockMessages, mockMembers } from "@/data/mockData";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Create a map of member data for quick lookup
const memberMap = mockMembers.reduce((acc, member) => {
  acc[member.id] = member;
  return acc;
}, {} as Record<string, typeof mockMembers[0]>);

export function TripChat() {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState({ name: "", imageUrl: "" });

  // Simulate typing indicator for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTypingUser({ name: "Sarah", imageUrl: memberMap["2"]?.imageUrl || "" });
      setTimeout(() => setIsTyping(false), 3000);
    }, 10000);
    
    // Show initially after 2 seconds
    const timeout = setTimeout(() => {
      setIsTyping(true);
      setTypingUser({ name: "Sarah", imageUrl: memberMap["2"]?.imageUrl || "" });
      setTimeout(() => setIsTyping(false), 3000);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
  const currentUserId = "1"; // Mock current user

  const handleSend = (message: string) => {
    console.log("Send message:", message);
    // Would send message here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages - scrolls within parent FocusedFlowLayout */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 scrollbar-hide">
        {mockMessages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          const isSystem = msg.type === "system";
          const sender = memberMap[msg.senderId];

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
              className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}
            >
              {/* Avatar for other users (WhatsApp style) */}
              {!isOwn && (
                <Avatar className="h-7 w-7 flex-shrink-0 mt-5">
                  <AvatarImage src={sender?.imageUrl} alt={msg.senderName} />
                  <AvatarFallback className="text-xs">{msg.senderName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn("flex flex-col gap-0.5 sm:gap-1", isOwn && "items-end")}>
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
            </div>
          );
        })}
        
        {/* Typing indicator with padding */}
        {isTyping && (
          <TypingIndicator 
            userName={typingUser.name} 
            userImageUrl={typingUser.imageUrl}
          />
        )}
      </div>

      {/* Composer - anchored at bottom */}
      <div className="flex-none border-t border-border/50">
        <ChatComposer onSend={handleSend} />
      </div>
    </div>
  );
}
