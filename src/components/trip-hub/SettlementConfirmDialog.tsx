import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, Receipt } from "lucide-react";
import { getCategoryFromTitle, getCategoryEmoji } from "@/lib/expenseCategories";
import { ReceiptViewerModal } from "./ReceiptViewerModal";

interface AffectedExpense {
  id: string;
  title: string;
  shareAmount: number;
  receiptUrl?: string;
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
  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
  const [selectedExpenseForReceipt, setSelectedExpenseForReceipt] = useState<AffectedExpense | null>(null);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleViewReceipt = (expense: AffectedExpense) => {
    setSelectedExpenseForReceipt(expense);
    setReceiptViewerOpen(true);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              Confirm Settlement
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Mark <span className="font-medium text-foreground">{formatCurrency(totalAmount)}</span> to{" "}
                  <span className="font-medium text-foreground">{recipientName}</span> as settled?
                </p>
                
                {affectedExpenses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      This will settle {affectedExpenses.length} expense{affectedExpenses.length > 1 ? "s" : ""}:
                    </p>
                    <ScrollArea className="max-h-48 rounded-lg border border-border bg-muted/30">
                      <div className="p-2 space-y-1.5">
                        {affectedExpenses.map((expense) => {
                          const category = getCategoryFromTitle(expense.title);
                          const emoji = getCategoryEmoji(category);
                          return (
                            <div
                              key={expense.id}
                              className="flex items-center justify-between py-1.5 px-2 rounded-md bg-background/50"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-sm flex-shrink-0">{emoji}</span>
                                <span className="text-sm text-foreground truncate">
                                  {expense.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7 w-7 rounded-md ${
                                    expense.receiptUrl 
                                      ? "text-primary hover:text-primary hover:bg-primary/10" 
                                      : "text-muted-foreground/40 cursor-not-allowed"
                                  }`}
                                  onClick={() => expense.receiptUrl && handleViewReceipt(expense)}
                                  disabled={!expense.receiptUrl}
                                  title={expense.receiptUrl ? "View receipt" : "No receipt attached"}
                                >
                                  <Receipt className="h-4 w-4" />
                                </Button>
                                <Badge variant="secondary" className="text-xs font-medium">
                                  {formatCurrency(expense.shareAmount)}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm Settlement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReceiptViewerModal
        open={receiptViewerOpen}
        onOpenChange={setReceiptViewerOpen}
        expenseTitle={selectedExpenseForReceipt?.title || ""}
        receiptUrl={selectedExpenseForReceipt?.receiptUrl}
      />
    </>
  );
}
