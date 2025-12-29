import { Link } from "react-router-dom";
import { ArrowRight, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettlementCardProps {
  fromUser: { id: string; name: string; imageUrl?: string };
  toUser: { id: string; name: string; imageUrl?: string };
  amount: number;
  currency?: string;
  status: "pending" | "paid";
  onViewPayment?: () => void;
  onMarkPaid?: () => void;
}

export function SettlementCard({
  fromUser,
  toUser,
  amount,
  currency = "RM",
  status,
  onViewPayment,
  onMarkPaid,
}: SettlementCardProps) {
  return (
    <Card className="p-4 border-border/50">
      <div className="flex items-center gap-3">
        {/* From User - Clickable */}
        <Link 
          to={`/user/${fromUser.id}`}
          className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {fromUser.imageUrl ? (
              <img src={fromUser.imageUrl} alt={fromUser.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-medium text-muted-foreground">
                {fromUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[60px]">
            {fromUser.name}
          </span>
        </Link>

        {/* Arrow & Amount */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px bg-border" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <span className="text-lg font-bold text-foreground">
            {currency} {amount.toLocaleString()}
          </span>
        </div>

        {/* To User - Clickable */}
        <Link 
          to={`/user/${toUser.id}`}
          className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {toUser.imageUrl ? (
              <img src={toUser.imageUrl} alt={toUser.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-medium text-muted-foreground">
                {toUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[60px]">
            {toUser.name}
          </span>
        </Link>
      </div>

      {/* Status & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-border/50">
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full w-fit",
            status === "paid"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning-foreground"
          )}
        >
          {status === "paid" ? "PAID" : "PENDING"}
        </span>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-full sm:w-auto text-xs sm:text-sm"
            onClick={onViewPayment}
          >
            <QrCode className="h-4 w-4 mr-1.5" />
            View QR
          </Button>
          {status === "pending" && (
            <Button 
              size="sm" 
              className="h-9 w-full sm:w-auto text-xs sm:text-sm"
              onClick={onMarkPaid}
            >
              Mark as Paid
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}