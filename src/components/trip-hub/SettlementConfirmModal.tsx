import { useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface BreakdownExpense {
  title: string;
  amount: number;
}

interface SettlementConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromUser: { id: string; name: string; imageUrl?: string };
  toUser: { id: string; name: string; imageUrl?: string };
  netAmount: number;
  // Breakdown data
  owedToReceiver: BreakdownExpense[];
  owedToDebtor: BreakdownExpense[];
  grossOwed: number;
  grossOffset: number;
  // Receipt (optional)
  receiptUrl?: string;
  onViewReceipt?: () => void;
  // Actions
  onConfirm: () => void;
}

const formatCurrency = (amount: number): string => {
  return `RM ${amount.toFixed(2)}`;
};

export function SettlementConfirmModal({
  open,
  onOpenChange,
  fromUser,
  toUser,
  netAmount,
  owedToReceiver,
  owedToDebtor,
  grossOwed,
  grossOffset,
  receiptUrl,
  onViewReceipt,
  onConfirm,
}: SettlementConfirmModalProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex-none p-4 pb-4 border-b border-border/50">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogTitle className="text-xl sm:text-lg font-semibold text-center">
            Confirm Settlement
          </DialogTitle>

          {/* From → To Visual */}
          <div className="flex items-center justify-center gap-4 pt-3">
            {/* From User */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-border">
                {fromUser.imageUrl ? (
                  <img src={fromUser.imageUrl} alt={fromUser.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-semibold text-muted-foreground">
                    {fromUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                {fromUser.name.split(' ')[0]}
              </span>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

            {/* To User */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-primary/50">
                {toUser.imageUrl ? (
                  <img src={toUser.imageUrl} alt={toUser.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-semibold text-muted-foreground">
                    {toUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                {toUser.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          {/* Section 1: Net Amount (Primary Focus) */}
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-foreground">
              {formatCurrency(netAmount)}
            </p>
            <p className="text-sm text-muted-foreground mt-1.5">
              Net amount to be settled
            </p>
            <p className="text-xs text-muted-foreground/80 mt-2 max-w-[280px] mx-auto">
              This is the final amount after offsetting shared expenses.
            </p>
          </div>

          {/* Section 2: Settlement Breakdown (Expandable) */}
          <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
              <span className="text-sm font-medium text-foreground">View breakdown</span>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  breakdownOpen && "rotate-180"
                )} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="rounded-xl bg-muted/30 border border-border/50 p-4 space-y-3">
                {/* Owes section */}
                {owedToReceiver.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {fromUser.name.split(' ')[0]} owes {toUser.name.split(' ')[0]}
                    </p>
                    {owedToReceiver.map((expense, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-foreground">• {expense.title}</span>
                        <span className="text-foreground font-medium tabular-nums">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Offset section */}
                {owedToDebtor.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Less: {toUser.name.split(' ')[0]} owes {fromUser.name.split(' ')[0]}
                    </p>
                    {owedToDebtor.map((expense, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-foreground">• {expense.title}</span>
                        <span className="text-stat-red font-medium tabular-nums">
                          -{formatCurrency(expense.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Net total line */}
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Net total</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {formatCurrency(netAmount)}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Section 3: Payment Receipt (Non-Blocking) */}
          <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
            <p className="text-sm font-medium text-foreground mb-2">Payment receipt</p>
            {receiptUrl ? (
              <div className="flex items-center gap-3">
                <img 
                  src={receiptUrl} 
                  alt="Payment receipt" 
                  className="h-16 w-16 rounded-lg object-cover border border-border/50"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onViewReceipt}
                  className="text-sm"
                >
                  View
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No receipt uploaded (optional)
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 pt-3 border-t border-border/50 space-y-2">
          <Button 
            onClick={handleConfirm} 
            className="w-full h-12 rounded-xl font-medium text-[15px]"
          >
            Confirm & Settle {formatCurrency(netAmount)}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full h-10 rounded-xl font-medium text-[15px] text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
