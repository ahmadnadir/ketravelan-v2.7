import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const messages = [
  {
    id: 1,
    type: "system",
    text: "Sarah joined the trip! 🎉",
  },
  {
    id: 2,
    type: "sent",
    user: { name: "Sarah", avatar: "S" },
    text: "Hey everyone! So excited for this trip 🌴",
  },
  {
    id: 3,
    type: "received",
    user: { name: "Ahmad", avatar: "A" },
    text: "Same! Anyone been to Langkawi before?",
  },
  {
    id: 4,
    type: "sent",
    user: { name: "Lisa", avatar: "L" },
    text: "I have! The cable car is a must! 🚡",
  },
];

export function ChatScreen() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
            ←
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-foreground truncate">
              Langkawi Island Adventure
            </h3>
            <p className="text-[10px] text-muted-foreground">
              8 members · 3 days away
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-3 py-3 space-y-2.5">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "system" ? (
              <div className="flex justify-center">
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {message.text}
                </span>
              </div>
            ) : message.type === "received" ? (
              <div className="flex items-end gap-1.5 max-w-[85%]">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                    {message.user?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-[8px] text-muted-foreground ml-1">
                    {message.user?.name}
                  </span>
                  <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-2.5 py-1.5">
                    <p className="text-[10px] text-foreground">{message.text}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-end gap-1.5 max-w-[85%] ml-auto flex-row-reverse">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                    {message.user?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <span className="text-[8px] text-muted-foreground mr-1">
                    {message.user?.name}
                  </span>
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-2.5 py-1.5">
                    <p className="text-[10px]">{message.text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-border/50 bg-card">
        <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
          <span className="text-[10px] text-muted-foreground">Message...</span>
        </div>
      </div>
    </div>
  );
}
