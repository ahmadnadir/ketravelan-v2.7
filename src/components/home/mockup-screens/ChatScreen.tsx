import { MapPin, Users, ChevronLeft, Paperclip, Send } from "lucide-react";

interface Message {
  id: number;
  type: "sent" | "received" | "system" | "expense";
  text: string;
  time?: string;
  user?: { name: string; avatar: string };
  amount?: string;
}

const messages: Message[] = [
  {
    id: 1,
    type: "sent",
    text: "Welcome everyone! Excited for our Langkawi trip 🎉",
    time: "10:00 AM",
  },
  {
    id: 2,
    type: "received",
    user: { name: "Sarah Tan", avatar: "ST" },
    text: "Can't wait! Should we meet at KL Sentral?",
    time: "10:05 AM",
  },
  {
    id: 3,
    type: "system",
    text: "Lisa Wong joined the trip",
  },
  {
    id: 4,
    type: "received",
    user: { name: "Lisa Wong", avatar: "LW" },
    text: "Hey everyone! Happy to be here 😊",
    time: "10:12 AM",
  },
  {
    id: 5,
    type: "sent",
    text: "Yes, KL Sentral at 7am works. I'll share the exact meeting point later.",
    time: "10:15 AM",
  },
  {
    id: 6,
    type: "expense",
    text: "Ferry tickets",
    amount: "RM 320",
    user: { name: "Ahmad", avatar: "AR" },
  },
];

const tabs = ["Chat", "Expenses", "Notes", "Members"];

export function ChatScreen() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Trip Header */}
      <div className="px-3 py-2.5 border-b border-border/50 bg-card">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-foreground truncate">
              Langkawi Island Adventure
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />
                Langkawi, Malaysia
              </span>
              <span className="flex items-center gap-0.5">
                <Users className="w-2.5 h-2.5" />5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border/50 bg-card">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-[10px] font-medium transition-colors ${
              index === 0
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-3 py-2 space-y-2">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "system" ? (
              <div className="flex justify-center py-1">
                <span className="text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {message.text}
                </span>
              </div>
            ) : message.type === "expense" ? (
              <div className="flex justify-center py-1">
                <div className="bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5 text-center">
                  <p className="text-[9px] text-muted-foreground">
                    {message.user?.name} added expense: {message.text}
                  </p>
                  <p className="text-[10px] font-semibold text-foreground">
                    {message.amount}
                  </p>
                </div>
              </div>
            ) : message.type === "received" ? (
              <div className="max-w-[80%]">
                <span className="text-[8px] text-muted-foreground ml-1">
                  {message.user?.name}
                </span>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-2.5 py-1.5 mt-0.5">
                  <p className="text-[10px] text-foreground">{message.text}</p>
                </div>
                <span className="text-[8px] text-muted-foreground ml-1">
                  {message.time}
                </span>
              </div>
            ) : (
              <div className="max-w-[80%] ml-auto text-right">
                <div className="bg-foreground text-background rounded-2xl rounded-tr-sm px-2.5 py-1.5">
                  <p className="text-[10px]">{message.text}</p>
                </div>
                <span className="text-[8px] text-muted-foreground mr-1">
                  {message.time}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="px-3 py-2 border-t border-border/50 bg-card">
        <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
          <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="flex-1 text-[10px] text-muted-foreground">
            Type a message...
          </span>
          <Send className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
