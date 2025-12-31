import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Users, Search, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { SwipeableChatItem } from "@/components/chat/SwipeableChatItem";
import { cn } from "@/lib/utils";
import { mockChats } from "@/data/mockData";
import { toast } from "sonner";

interface ChatItem {
  id: string;
  name: string;
  type: "trip" | "direct";
  lastMessage: string;
  unread: number;
  imageUrl?: string;
}

export default function Chat() {
  const [chatFilter, setChatFilter] = useState<"trips" | "direct">("trips");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatItem[]>(mockChats as ChatItem[]);

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const matchesTab = chatFilter === "trips" ? chat.type === "trip" : chat.type === "direct";
      const matchesSearch = searchQuery === "" ||
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [chatFilter, searchQuery, chats]);

  const tripsHaveUnread = chats.some((c) => c.type === "trip" && c.unread > 0);
  const directHaveUnread = chats.some((c) => c.type === "direct" && c.unread > 0);

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    toast.success("Chat deleted");
  };

  const handleMarkAsRead = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c))
    );
    toast.success("Marked as read");
  };

  return (
    <AppLayout>
      <div className="py-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <SegmentedControl
          options={[
            { label: "DIY Trips", value: "trips", hasUnread: tripsHaveUnread },
            { label: "Direct Messages", value: "direct", hasUnread: directHaveUnread },
          ]}
          value={chatFilter}
          onChange={(value) => setChatFilter(value as "trips" | "direct")}
        />

        <div className="space-y-0">
          {filteredChats.map((chat) => (
            <SwipeableChatItem
              key={chat.id}
              onDelete={() => handleDeleteChat(chat.id)}
              onMarkAsRead={() => handleMarkAsRead(chat.id)}
              hasUnread={chat.unread > 0}
            >
              <Link
                to={
                  chat.type === "trip"
                    ? `/trip/${chat.id.replace("trip-", "")}/hub`
                    : `/chat/${chat.id}`
                }
              >
                <Card className="p-4 border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                        {chat.imageUrl ? (
                          <img
                            src={chat.imageUrl}
                            alt={chat.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            {chat.type === "trip" ? (
                              <Users className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <MessageCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                      {chat.type === "trip" && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-[10px] text-primary-foreground font-medium">
                            G
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {chat.name}
                      </h4>
                      <p
                        className={cn(
                          "text-sm truncate",
                          chat.unread > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center shrink-0 self-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            </SwipeableChatItem>
          ))}
        </div>

        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No results found</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary text-sm hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : chatFilter === "trips" ? (
              <>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No trip chats yet</p>
              </>
            ) : (
              <>
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No direct messages yet</p>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
