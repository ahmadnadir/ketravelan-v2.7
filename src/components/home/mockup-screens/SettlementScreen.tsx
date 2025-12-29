import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, QrCode, Bell, Check } from "lucide-react";

const settlements = [
  {
    id: 1,
    from: { name: "Sarah", avatar: "S" },
    to: { name: "Ahmad", avatar: "A" },
    amount: 120,
    status: "pending",
  },
  {
    id: 2,
    from: { name: "Lisa", avatar: "L" },
    to: { name: "Ahmad", avatar: "A" },
    amount: 85,
    status: "paid",
  },
];

export function SettlementScreen() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 bg-card">
        <h3 className="text-xs font-semibold text-foreground">Who Pays Who</h3>
      </div>

      <div className="flex-1 overflow-hidden px-3 py-3 space-y-2.5">
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
  );
}
