import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MapPin, Users, Search, Plus, Pin, DollarSign, TrendingUp, TrendingDown, Wallet, Paperclip, Send, MoreVertical } from "lucide-react";
import { mockMessages, mockMembers, mockExpenses } from "@/data/mockData";

type TabType = "chat" | "expenses" | "notes";
type ExpenseSubTab = "breakdown" | "expenses" | "settle" | "qr";

// Category emoji map matching actual implementation
const categoryEmojiMap: Record<string, string> = {
  "Transport": "🚗",
  "Food & Drinks": "🍴",
  "Accommodation": "🏨",
  "Activities": "🎫",
  "Shopping": "🛍️",
  "Other": "📦",
};

const categoryBreakdown = [
  { category: "Transport", amount: 770, percentage: 30, color: "bg-stat-blue", emoji: "🚗" },
  { category: "Food & Drinks", amount: 560, percentage: 22, color: "bg-stat-orange", emoji: "🍴" },
  { category: "Accommodation", amount: 1200, percentage: 47, color: "bg-purple-500", emoji: "🏨" },
  { category: "Activities", amount: 180, percentage: 7, color: "bg-stat-green", emoji: "🎫" },
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
  ];

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px] lg:w-[300px]">
      {/* Floating Screen with shadow */}
      <div className="relative bg-background rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-border/30 h-[460px] sm:h-[500px] lg:h-[540px] flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border/50 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
              <ChevronLeft className="h-3 w-3 text-muted-foreground" />
            </div>
            
            {/* Circular Trip Image */}
            <div className="h-7 w-7 rounded-full overflow-hidden border border-border/50 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200" 
                alt="Langkawi" 
                className="h-full w-full object-cover" 
              />
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

          {/* Tab Navigation - matches SegmentedControl styling */}
          <div className="flex p-0.5 mt-2 bg-secondary rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex-1 py-1.5 px-1.5 text-[9px] font-medium rounded-lg transition-all",
                  activeTab === tab.value
                    ? "bg-card text-foreground shadow-sm"
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
        </div>
      </div>
    </div>
  );
}

// Create a map of member data for quick lookup
const memberMap = mockMembers.reduce((acc, member) => {
  acc[member.id] = member;
  return acc;
}, {} as Record<string, typeof mockMembers[0]>);

function MockChatContent() {
  const currentUserId = "1";

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2 space-y-2">
        {mockMessages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          const isSystem = msg.type === "system";
          const sender = memberMap[msg.senderId];

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
              className={cn("flex gap-1.5", isOwn ? "justify-end" : "justify-start")}
            >
              {/* Avatar for other users (WhatsApp style) */}
              {!isOwn && (
                <div className="h-5 w-5 rounded-full bg-muted overflow-hidden shrink-0 mt-3">
                  {sender?.imageUrl ? (
                    <img src={sender.imageUrl} alt={msg.senderName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground font-semibold text-[8px]">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                </div>
              )}
              
              <div className={cn("flex flex-col gap-0.5", isOwn && "items-end")}>
                {!isOwn && (
                  <span className="text-[8px] text-muted-foreground ml-2">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[85%] px-2.5 py-1.5 rounded-2xl",
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
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-border/50 bg-card px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
            <Paperclip className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1 bg-secondary rounded-full px-2.5 py-1">
            <span className="text-[9px] text-muted-foreground">Type a message...</span>
          </div>
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
            <Send className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockExpensesContent() {
  const [subTab, setSubTab] = useState<ExpenseSubTab>("breakdown");
  const totalCost = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

  const subTabs: { label: string; value: ExpenseSubTab }[] = [
    { label: "Summary", value: "breakdown" },
    { label: "All Expenses", value: "expenses" },
    { label: "Settlement", value: "settle" },
    { label: "QR", value: "qr" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-2 py-2 space-y-2">
        {/* Header */}
        <div>
          <h2 className="text-[11px] font-semibold text-foreground">Trip Expenses Overview</h2>
          <p className="text-[8px] text-muted-foreground">See where the money went and who's settled.</p>
        </div>

        {/* Stat Cards - with improved layout */}
        <div className="grid grid-cols-2 gap-1.5">
          <StatCardMini icon={DollarSign} title="Total Trip Spend" value={`RM ${totalCost.toLocaleString()}`} color="blue" />
          <StatCardMini icon={Wallet} title="You Paid" value="RM 680" color="green" />
          <StatCardMini icon={TrendingUp} title="You're Owed" value="RM 85" color="orange" />
          <StatCardMini icon={TrendingDown} title="You Owe" value="RM 120" color="red" />
        </div>

        {/* Sub Tabs - matches ScrollableTabBar pill styling */}
        <div className="relative">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide p-0.5">
            {subTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSubTab(tab.value)}
                className={cn(
                  "py-1 px-2.5 text-[8px] font-medium rounded-full whitespace-nowrap transition-all shrink-0",
                  subTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Scroll hint */}
          <div className="absolute right-0 top-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-0.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground opacity-50" />
          </div>
        </div>

        {/* Sub Tab Content */}
        {subTab === "breakdown" && <BreakdownContent totalCost={totalCost} />}
        {subTab === "expenses" && <ExpensesListContent />}
        {subTab === "settle" && <SettleContent />}
        {subTab === "qr" && <QRContent />}
      </div>
    </div>
  );
}

function BreakdownContent({ totalCost }: { totalCost: number }) {
  return (
    <>
      {/* Category Breakdown */}
      <div className="bg-card border border-border/50 rounded-xl p-2 space-y-1.5">
        <h3 className="text-[9px] font-semibold text-foreground">Spending by Category</h3>
        {categoryBreakdown.map((item) => (
          <div key={item.category} className="space-y-0.5">
            <div className="flex items-center justify-between text-[8px]">
              <span className="text-foreground flex items-center gap-1">
                <span>{item.emoji}</span> {item.category}
              </span>
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
    </>
  );
}

function ExpensesListContent() {
  return (
    <div className="space-y-1.5">
      {mockExpenses.slice(0, 4).map((expense) => {
        const emoji = categoryEmojiMap[expense.category] || "📦";
        return (
          <div key={expense.id} className="bg-card border border-border/50 rounded-xl p-2 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm">{emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[9px] font-medium text-foreground truncate">{expense.title}</h4>
              <p className="text-[7px] text-muted-foreground">Paid by {expense.paidBy}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-foreground">RM {expense.amount}</p>
              <p className="text-[7px] text-muted-foreground">{expense.category}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SettleContent() {
  const settlements = [
    { from: mockMembers[1], to: mockMembers[0], amount: 120, status: "pending" },
    { from: mockMembers[0], to: mockMembers[2], amount: 85, status: "paid" },
    { from: mockMembers[3], to: mockMembers[0], amount: 45, status: "pending" },
  ];

  return (
    <div className="space-y-1.5">
      {settlements.map((s, i) => (
        <div key={i} className="bg-card border border-border/50 rounded-xl p-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
              {s.from.imageUrl ? (
                <img src={s.from.imageUrl} alt={s.from.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[8px] font-medium">{s.from.name.charAt(0)}</div>
              )}
            </div>
            <span className="text-[8px] text-muted-foreground">→</span>
            <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
              {s.to.imageUrl ? (
                <img src={s.to.imageUrl} alt={s.to.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[8px] font-medium">{s.to.name.charAt(0)}</div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] text-foreground truncate">{s.from.name} → {s.to.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold text-foreground">RM {s.amount}</p>
            <span className={cn(
              "text-[7px] px-1 py-0.5 rounded-full",
              s.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            )}>
              {s.status === "paid" ? "Paid" : "Pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function QRContent() {
  return (
    <div className="space-y-2">
      {/* Your QR */}
      <div className="bg-card border border-border/50 rounded-xl p-2 space-y-1.5">
        <h3 className="text-[9px] font-semibold text-foreground">Your Payment QR</h3>
        <div className="h-20 bg-secondary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto bg-muted rounded-lg flex items-center justify-center mb-1">
              <span className="text-[8px] text-muted-foreground">QR Code</span>
            </div>
            <button className="text-[8px] text-primary font-medium">Upload QR</button>
          </div>
        </div>
      </div>

      {/* Members QR */}
      <div className="bg-card border border-border/50 rounded-xl p-2 space-y-1.5">
        <h3 className="text-[9px] font-semibold text-foreground">Members' QR Codes</h3>
        {mockMembers.slice(0, 3).map((member) => (
          <div key={member.id} className="flex items-center gap-2 py-1 border-b border-border/30 last:border-0">
            <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[8px] font-medium">{member.name.charAt(0)}</div>
              )}
            </div>
            <span className="flex-1 text-[8px] text-foreground truncate">{member.name}</span>
            <button className="text-[7px] text-primary font-medium">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockNotesContent() {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide px-2 py-2 space-y-2">
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
    <div className="bg-card border border-border/50 rounded-xl p-2 hover:border-primary/30 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="text-[9px] font-semibold text-foreground truncate">
              {note.title}
            </h4>
            {note.pinned && (
              <Pin className="h-2 w-2 text-primary fill-primary shrink-0" />
            )}
          </div>
          <p className="text-[8px] text-muted-foreground line-clamp-2 mt-0.5">
            {note.content}
          </p>
          <p className="text-[6px] text-muted-foreground/70 mt-1">{note.time}</p>
        </div>
        <MoreVertical className="h-3 w-3 text-muted-foreground shrink-0" />
      </div>
    </div>
  );
}

function StatCardMini({ icon: Icon, title, value, color }: { icon: React.ElementType; title: string; value: string; color: "blue" | "green" | "orange" | "red" }) {
  const colorClasses = {
    blue: "bg-stat-blue/10 text-stat-blue",
    green: "bg-stat-green/10 text-stat-green",
    orange: "bg-stat-orange/10 text-stat-orange",
    red: "bg-stat-red/10 text-stat-red",
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-2 flex items-center gap-2">
      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", colorClasses[color])}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[7px] text-muted-foreground truncate">{title}</p>
        <p className="text-[10px] font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
