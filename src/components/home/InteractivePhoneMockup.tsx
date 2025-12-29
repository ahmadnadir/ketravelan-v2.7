import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, MapPin, Users, Shield, MessageCircle, ExternalLink, Search, Plus, Pin, DollarSign, TrendingUp, TrendingDown, Wallet, Paperclip, Send } from "lucide-react";
import { mockMessages, mockMembers, mockExpenses } from "@/data/mockData";

type TabType = "chat" | "expenses" | "notes" | "members";

const categoryBreakdown = [
  { category: "Transport", amount: 770, percentage: 30, color: "bg-blue-500" },
  { category: "Food & Drinks", amount: 560, percentage: 22, color: "bg-orange-500" },
  { category: "Accommodation", amount: 1200, percentage: 47, color: "bg-purple-500" },
  { category: "Activities", amount: 180, percentage: 7, color: "bg-green-500" },
];

const mockNotes = [
  { id: "1", title: "Packing List", content: "Sunscreen, Swimsuit, Comfortable shoes...", pinned: true, time: "2h ago" },
  { id: "2", title: "Restaurant Recommendations", content: "Wonderland Food Store - Laksa...", pinned: false, time: "1d ago" },
  { id: "3", title: "Emergency Contacts", content: "Trip Leader: Ahmad - 012-345-6789", pinned: true, time: "3d ago" },
];

export function InteractivePhoneMockup() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");

  const tabs: { label: string; value: TabType }[] = [
    { label: "Chat", value: "chat" },
    { label: "Expenses", value: "expenses" },
    { label: "Notes", value: "notes" },
    { label: "Members", value: "members" },
  ];

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px] md:w-[320px]">
      {/* Floating Screen with shadow */}
      <div className="relative bg-background rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-border/30 h-[500px] sm:h-[540px] md:h-[580px] flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border/50 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
              <ChevronLeft className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate text-[11px]">Langkawi Island Adventure</h1>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <MapPin className="h-2 w-2 shrink-0" />
                <span className="truncate">Langkawi, Malaysia</span>
                <span>•</span>
                <Users className="h-2 w-2 shrink-0" />
                <span>{mockMembers.length}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-0.5 mt-2 bg-secondary rounded-lg p-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex-1 py-1 px-1.5 text-[9px] font-medium rounded-md transition-all",
                  activeTab === tab.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" && <MockChatContent />}
          {activeTab === "expenses" && <MockExpensesContent />}
          {activeTab === "notes" && <MockNotesContent />}
          {activeTab === "members" && <MockMembersContent />}
        </div>
      </div>
    </div>
  );
}

function MockChatContent() {
  const currentUserId = "1";

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {mockMessages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          const isSystem = msg.type === "system";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[8px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={cn("flex flex-col gap-0.5", isOwn && "items-end")}
            >
              {!isOwn && (
                <span className="text-[8px] text-muted-foreground ml-2">
                  {msg.senderName}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[85%] px-2.5 py-1.5 rounded-xl",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                )}
              >
                <p className="text-[10px]">{msg.content}</p>
              </div>
              <span className={cn(
                "text-[7px] text-muted-foreground",
                isOwn ? "mr-1" : "ml-2"
              )}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-border/50 bg-card px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
            <Paperclip className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1 bg-secondary rounded-full px-2.5 py-1">
            <span className="text-[9px] text-muted-foreground">Type a message...</span>
          </div>
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <Send className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockExpensesContent() {
  const totalCost = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-2 py-2 space-y-2">
        {/* Header */}
        <div>
          <h2 className="text-[11px] font-semibold text-foreground">Trip Expenses Overview</h2>
          <p className="text-[8px] text-muted-foreground">See where the money went and who's settled.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-1.5">
          <StatCardMini icon={DollarSign} title="Total Trip Spend" value={`RM ${totalCost.toLocaleString()}`} color="blue" />
          <StatCardMini icon={Wallet} title="You Paid" value="RM 680" color="green" />
          <StatCardMini icon={TrendingUp} title="You're Owed" value="RM 85" color="orange" />
          <StatCardMini icon={TrendingDown} title="You Owe" value="RM 120" color="red" />
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-0.5 bg-secondary rounded-md p-0.5">
          {["Breakdown", "Expenses", "Settle", "QR"].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                "flex-1 py-0.5 px-1 text-[8px] font-medium rounded transition-all",
                i === 0 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border/50 rounded-xl p-2 space-y-1.5">
          <h3 className="text-[9px] font-semibold text-foreground">Spending by Category</h3>
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-0.5">
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-foreground">{item.category}</span>
                <span className="text-muted-foreground">RM {item.amount} ({item.percentage}%)</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Per Person */}
        <div className="bg-card border border-border/50 rounded-xl p-2 space-y-1">
          <h3 className="text-[9px] font-semibold text-foreground">Upfront Payment per Person</h3>
          <p className="text-sm font-bold text-primary">RM {Math.round(totalCost / mockMembers.length).toLocaleString()}</p>
          {mockMembers.slice(0, 3).map((member, index) => {
            const contribution = [850, 680, 450][index] || 500;
            const percentage = Math.round((contribution / totalCost) * 100);
            return (
              <div key={member.id} className="space-y-0.5">
                <div className="flex items-center justify-between text-[8px]">
                  <span className="text-foreground">{member.name}</span>
                  <span className="text-muted-foreground">RM {contribution} ({percentage}%)</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MockNotesContent() {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-2 py-2 space-y-2">
      {/* Search & Add */}
      <div className="flex gap-1.5">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground" />
          <div className="w-full pl-6 pr-2 py-1 rounded-lg bg-secondary text-[9px] text-muted-foreground">
            Search notes...
          </div>
        </div>
        <button className="bg-primary text-primary-foreground px-2 py-1 rounded-lg flex items-center gap-0.5 text-[9px] font-medium">
          <Plus className="h-2.5 w-2.5" />
          New
        </button>
      </div>

      {/* Pinned Notes */}
      <div className="space-y-1.5">
        <h3 className="text-[8px] font-medium text-muted-foreground flex items-center gap-1">
          <Pin className="h-2.5 w-2.5" />
          Pinned
        </h3>
        {mockNotes.filter(n => n.pinned).map((note) => (
          <NoteCardMini key={note.id} note={note} />
        ))}
      </div>

      {/* Other Notes */}
      <div className="space-y-1.5">
        <h3 className="text-[8px] font-medium text-muted-foreground">All Notes</h3>
        {mockNotes.filter(n => !n.pinned).map((note) => (
          <NoteCardMini key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

function NoteCardMini({ note }: { note: { id: string; title: string; content: string; pinned: boolean; time: string } }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-2 space-y-0.5">
      <div className="flex items-center gap-1">
        <h4 className="text-[10px] font-semibold text-foreground truncate">{note.title}</h4>
        {note.pinned && <Pin className="h-2 w-2 text-primary fill-primary shrink-0" />}
      </div>
      <p className="text-[8px] text-muted-foreground line-clamp-1">{note.content}</p>
      <p className="text-[7px] text-muted-foreground/70">{note.time}</p>
    </div>
  );
}

function MockMembersContent() {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-2 py-2 space-y-2">
      {/* Safety Notice */}
      <div className="bg-accent/30 border border-border/50 rounded-xl p-2 flex items-start gap-1.5">
        <div className="p-1 rounded-lg bg-primary/10 shrink-0">
          <Shield className="h-3 w-3 text-primary" />
        </div>
        <div>
          <h3 className="text-[9px] font-semibold text-foreground">Safety & Security</h3>
          <p className="text-[8px] text-muted-foreground">All members have verified their identity.</p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-1.5">
        {mockMembers.slice(0, 4).map((member) => (
          <div key={member.id} className="bg-card border border-border/50 rounded-xl p-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground font-semibold text-[10px]">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-[10px] font-medium text-foreground truncate">{member.name}</h4>
                {member.role === "Organizer" && (
                  <span className="text-[7px] bg-primary/10 text-primary px-1 py-0.5 rounded-full font-medium">
                    Organizer
                  </span>
                )}
              </div>
              <span className="text-[8px] text-muted-foreground">5 trips completed</span>
            </div>
            <div className="flex gap-1">
              <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                <ExternalLink className="h-2 w-2 text-muted-foreground" />
              </div>
              <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                <MessageCircle className="h-2.5 w-2.5 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCardMini({ icon: Icon, title, value, color }: { icon: React.ElementType; title: string; value: string; color: "blue" | "green" | "orange" | "red" }) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600",
    green: "bg-green-500/10 text-green-600",
    orange: "bg-orange-500/10 text-orange-600",
    red: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-2 space-y-0.5">
      <div className={cn("h-5 w-5 rounded-lg flex items-center justify-center", colorClasses[color])}>
        <Icon className="h-2.5 w-2.5" />
      </div>
      <p className="text-[7px] text-muted-foreground">{title}</p>
      <p className="text-[11px] font-bold text-foreground">{value}</p>
    </div>
  );
}
