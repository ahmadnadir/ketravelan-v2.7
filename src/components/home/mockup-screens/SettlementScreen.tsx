import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, ChevronLeft, ArrowRight, QrCode, Bell, Check, Wallet, Receipt, TrendingUp, TrendingDown } from "lucide-react";

const tabs = ["Chat", "Expenses", "Notes", "Members"];
const subTabs = ["Breakdown", "Expenses", "Settle", "QR Codes"];

const settlements = [
  {
    id: 1,
    from: { name: "Sarah", avatar: "ST" },
    to: { name: "Ahmad", avatar: "AR" },
    amount: 120,
    status: "pending",
  },
  {
    id: 2,
    from: { name: "Lisa", avatar: "LW" },
    to: { name: "Ahmad", avatar: "AR" },
    amount: 85,
    status: "paid",
  },
];

export function SettlementScreen() {
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
              index === 1
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-3 py-2.5 space-y-2">
        {/* Compact Stats Row */}
        <div className="grid grid-cols-4 gap-1">
          <div className="bg-card border border-border/50 rounded-lg p-1.5 text-center">
            <Wallet className="w-3 h-3 text-primary mx-auto mb-0.5" />
            <p className="text-[9px] font-bold text-foreground">RM 2,430</p>
            <p className="text-[7px] text-muted-foreground">Total</p>
          </div>
          <div className="bg-card border border-border/50 rounded-lg p-1.5 text-center">
            <Receipt className="w-3 h-3 text-primary mx-auto mb-0.5" />
            <p className="text-[9px] font-bold text-foreground">RM 680</p>
            <p className="text-[7px] text-muted-foreground">Paid</p>
          </div>
          <div className="bg-card border border-border/50 rounded-lg p-1.5 text-center">
            <TrendingUp className="w-3 h-3 text-green-600 mx-auto mb-0.5" />
            <p className="text-[9px] font-bold text-green-600">RM 85</p>
            <p className="text-[7px] text-muted-foreground">Owed</p>
          </div>
          <div className="bg-card border border-border/50 rounded-lg p-1.5 text-center">
            <TrendingDown className="w-3 h-3 text-amber-600 mx-auto mb-0.5" />
            <p className="text-[9px] font-bold text-amber-600">RM 120</p>
            <p className="text-[7px] text-muted-foreground">Owe</p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {subTabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-2 py-1 text-[9px] font-medium rounded-full whitespace-nowrap transition-colors ${
                index === 2
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5">
          <button className="px-2 py-0.5 text-[8px] bg-muted rounded-full text-muted-foreground flex items-center gap-1">
            All Directions
            <ChevronLeft className="w-2 h-2 rotate-[-90deg]" />
          </button>
          <button className="px-2 py-0.5 text-[8px] bg-muted rounded-full text-muted-foreground flex items-center gap-1">
            All Status
            <ChevronLeft className="w-2 h-2 rotate-[-90deg]" />
          </button>
        </div>

        {/* Settlement Cards */}
        <div className="space-y-2">
          {settlements.map((settlement) => (
            <div
              key={settlement.id}
              className="bg-card border border-border/50 rounded-xl p-2.5 space-y-2"
            >
              {/* Users and Amount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[8px] bg-muted text-muted-foreground">
                      {settlement.from.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[9px] text-muted-foreground">
                    {settlement.from.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full">
                  <span className="text-[10px] font-semibold text-foreground">
                    RM {settlement.amount}
                  </span>
                  <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground">
                    {settlement.to.name}
                  </span>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                      {settlement.to.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`text-[8px] font-medium px-2 py-0.5 rounded-full ${
                    settlement.status === "paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  {settlement.status === "paid" ? (
                    <span className="flex items-center gap-0.5">
                      <Check className="h-2 w-2" /> PAID
                    </span>
                  ) : (
                    "PENDING"
                  )}
                </span>
              </div>

              {/* Action Buttons (only for pending) */}
              {settlement.status === "pending" && (
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-center gap-1 text-[9px] py-1.5 border border-border rounded-lg text-muted-foreground">
                    <QrCode className="h-2.5 w-2.5" /> View QR
                  </button>
                  <button className="w-full flex items-center justify-center gap-1 text-[9px] py-1.5 border border-border rounded-lg text-muted-foreground">
                    <Bell className="h-2.5 w-2.5" /> Send Reminder
                  </button>
                  <button className="w-full text-[9px] py-1.5 bg-foreground text-background rounded-lg font-medium">
                    Mark as Paid
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
