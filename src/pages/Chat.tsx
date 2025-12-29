import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { cn } from "@/lib/utils";
import { mockChats } from "@/data/mockData";

export default function Chat() {
  const [chatFilter, setChatFilter] = useState<"trips" | "direct">("trips");

  const filteredChats = useMemo(() => {
    return mockChats.filter((chat) =>
      chatFilter === "trips" ? chat.type === "trip" : chat.type === "direct"
    );
  }, [chatFilter]);

  const tripCount = mockChats.filter((c) => c.type === "trip").length;
  const directCount = mockChats.filter((c) => c.type === "direct").length;

  return (
    <AppLayout>
      <div className="py-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>

        {/* Tabs */}
        <SegmentedControl
          options={[
            { label: "Trips", value: "trips", count: tripCount },
            { label: "Direct", value: "direct", count: directCount },
          ]}
          value={chatFilter}
          onChange={(value) => setChatFilter(value as "trips" | "direct")}
        />

        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Link
              key={chat.id}
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
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground truncate">
                        {chat.name}
                      </h4>
                      {chat.unread > 0 && (
                        <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
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
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            {chatFilter === "trips" ? (
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            ) : (
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            )}
            <p className="text-muted-foreground">
              {chatFilter === "trips"
                ? "No trip chats yet"
                : "No direct messages yet"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}