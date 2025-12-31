import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { getCategoryFromTitle, getCategoryEmoji } from "@/lib/expenseCategories";

interface AffectedExpense {
  id: string;
  title: string;
  shareAmount: number;
}

interface SettlementConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  totalAmount: number;
  affectedExpenses: AffectedExpense[];
  onConfirm: () => void;
}

const formatCurrency = (amount: number): string => {
  return `RM ${amount.toFixed(2)}`;
};

export function SettlementConfirmDialog({
  open,
  onOpenChange,
  recipientName,
  totalAmount,
  affectedExpenses,
  onConfirm,
}: SettlementConfirmDialogProps) {
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

          <DialogTitle className="flex items-center gap-2 text-xl sm:text-lg font-semibold">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-4 w-4 text-primary" />
            </div>
            Confirm Settlement
          </DialogTitle>
          
          <p className="text-[15px] sm:text-sm text-muted-foreground mt-2">
            Mark <span className="font-medium text-foreground">{formatCurrency(totalAmount)}</span> to{" "}
            <span className="font-medium text-foreground">{recipientName}</span> as settled?
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {affectedExpenses.length > 0 && (
            <div className="space-y-3">
              <p className="text-[15px] sm:text-sm font-medium text-foreground">
                This will settle {affectedExpenses.length} expense{affectedExpenses.length > 1 ? "s" : ""}:
              </p>
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {affectedExpenses.map((expense) => {
                    const category = getCategoryFromTitle(expense.title);
                    const emoji = getCategoryEmoji(category);
                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{emoji}</span>
                          <span className="text-[15px] sm:text-sm font-medium text-foreground truncate max-w-[180px]">
                            {expense.title}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-[13px] sm:text-xs font-semibold bg-background">
                          {formatCurrency(expense.shareAmount)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-none p-4 pt-3 border-t border-border/50 space-y-2">
          <Button 
            onClick={handleConfirm} 
            className="w-full h-11 rounded-xl font-medium"
          >
            Confirm Settlement
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full h-11 rounded-xl font-medium"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
