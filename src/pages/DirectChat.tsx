import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FocusedFlowLayout } from "@/components/layout/FocusedFlowLayout";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { UserQuickActionsModal } from "@/components/chat/UserQuickActionsModal";
import { cn } from "@/lib/utils";

// Mock direct messages for demo
const mockDirectMessages = [
  { id: "1", senderId: "other", content: "Hey! Are you joining the Langkawi trip?", timestamp: "10:00 AM" },
  { id: "2", senderId: "me", content: "Yes! Just signed up yesterday", timestamp: "10:02 AM" },
  { id: "3", senderId: "other", content: "Awesome! It's going to be so much fun 🎉", timestamp: "10:03 AM" },
  { id: "4", senderId: "me", content: "Can't wait! Do you know what we need to bring?", timestamp: "10:05 AM" },
  { id: "5", senderId: "other", content: "Ahmad shared a packing list in the group chat. Mostly sunscreen, swimwear, and comfortable shoes.", timestamp: "10:08 AM" },
  { id: "6", senderId: "me", content: "Thanks for the info!", timestamp: "10:10 AM" },
];

// Mock user data with IDs
const mockUsers: Record<string, { id: string; name: string; imageUrl?: string }> = {
  "dm-1": { id: "2", name: "Sarah Tan", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
  "dm-2": { id: "4", name: "John Lee", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
};

export default function DirectChat() {
  const { id } = useParams();
  const user = mockUsers[id || "dm-1"] || { id: "1", name: "Unknown User" };
  const [userModalOpen, setUserModalOpen] = useState(false);

  const handleSend = (message: string) => {
    console.log("Send message:", message);
    // Would send message here
  };

  const headerContent = (
    <header className="glass border-b border-border/50 safe-top">
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 h-14">
          <Link to="/chat">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          {/* Clickable Avatar + Name opens modal */}
          <button 
            onClick={() => setUserModalOpen(true)}
            className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate">{user.name}</h1>
            </div>
          </button>
        </div>
      </div>
    </header>
  );

  const footerContent = (
    <div className="safe-bottom">
      <ChatComposer onSend={handleSend} />
    </div>
  );

  return (
    <FocusedFlowLayout 
      headerContent={headerContent} 
      footerContent={footerContent}
      showBottomNav={true}
    >
      <div className="container max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3">
        {mockDirectMessages.map((msg) => {
          const isOwn = msg.senderId === "me";

          return (
            <div
              key={msg.id}
              className={cn("flex flex-col gap-0.5", isOwn && "items-end")}
            >
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
                isOwn ? "mr-1" : "ml-2"
              )}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* User Quick Actions Modal */}
      <UserQuickActionsModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        user={user}
      />
    </FocusedFlowLayout>
  );
}
