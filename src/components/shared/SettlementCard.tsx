import { Link } from "react-router-dom";
import { ArrowRight, QrCode, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettlementCardProps {
  fromUser: { id: string; name: string; imageUrl?: string };
  toUser: { id: string; name: string; imageUrl?: string };
  amount: number;
  currency?: string;
  status: "pending" | "paid";
  showReminder?: boolean;
  onCardClick?: () => void;
  onViewPayment?: () => void;
  onSendReminder?: () => void;
  onMarkPaid?: () => void;
}

export function SettlementCard({
  fromUser,
  toUser,
  amount,
  currency = "RM",
  status,
  showReminder,
  onCardClick,
  onViewPayment,
  onSendReminder,
  onMarkPaid,
}: SettlementCardProps) {
  return (
    <Card 
      className="p-4 border-border/50 cursor-pointer hover:bg-muted/30 transition-colors active:scale-[0.99]"
      onClick={onCardClick}
    >
      {/* Top Section: From → To (Compact Context) */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* From User */}
        <Link 
          to={`/user/${fromUser.id}`}
          className="flex items-start gap-2 hover:opacity-80 transition-opacity min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {fromUser.imageUrl ? (
              <img src={fromUser.imageUrl} alt={fromUser.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {fromUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-foreground line-clamp-2 max-w-[90px] leading-tight">
            {fromUser.name}
          </span>
        </Link>

        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />

        {/* To User */}
        <Link 
          to={`/user/${toUser.id}`}
          className="flex items-start gap-2 hover:opacity-80 transition-opacity min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs font-medium text-foreground line-clamp-2 max-w-[90px] leading-tight text-right">
            {toUser.name}
          </span>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {toUser.imageUrl ? (
              <img src={toUser.imageUrl} alt={toUser.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {toUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Middle Section: Net Amount (Primary Focus) */}
      <div className="text-center py-2">
        <p className="text-2xl font-bold text-foreground">
          {currency} {amount.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Net amount owed</p>
      </div>

      {/* Status Badge - Centered */}
      <div className="flex justify-center mb-3">
        <span
          className={cn(
            "text-xs font-medium px-3 py-1 rounded-full",
            status === "paid"
              ? "bg-stat-green/10 text-stat-green"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          )}
        >
          {status === "paid" ? "Paid" : "Pending"}
        </span>
      </div>

      {/* Actions - Stacked at bottom */}
      <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
        {/* View QR - Always visible */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-10 text-sm"
          onClick={(e) => { e.stopPropagation(); onViewPayment?.(); }}
        >
          <QrCode className="h-4 w-4 mr-2" />
          View QR
        </Button>
        
        {/* Send Reminder - Ghost style, only when pending and showReminder */}
        {showReminder && status === "pending" && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-10 text-sm"
            onClick={(e) => { e.stopPropagation(); onSendReminder?.(); }}
          >
            <Bell className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
        )}
        
        {/* Mark as Paid - Primary, only when pending */}
        {status === "pending" && (
          <Button 
            size="sm" 
            className="w-full h-10 text-sm bg-foreground text-background hover:bg-foreground/90"
            onClick={(e) => { e.stopPropagation(); onMarkPaid?.(); }}
          >
            Mark as Paid
          </Button>
        )}
      </div>
    </Card>
  );
}