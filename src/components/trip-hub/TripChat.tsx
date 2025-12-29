import { cn } from "@/lib/utils";
import { mockMessages } from "@/data/mockData";
import { ChatComposer } from "@/components/chat/ChatComposer";

export function TripChat() {
  const currentUserId = "1"; // Mock current user

  const handleSend = (message: string) => {
    console.log("Send message:", message);
    // Would send message here
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

      {/* Composer */}
      <ChatComposer onSend={handleSend} />
    </div>
  );
}
