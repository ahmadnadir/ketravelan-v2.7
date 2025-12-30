import { ArrowRight, X, Bell, Upload, Receipt, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCategoryById } from "@/lib/expenseCategories";

export interface SettlementExpense {
  expenseId: string;
  title: string;
  date: string;
  shareAmount: number;
  status: "pending" | "submitted" | "settled";
  category: string;
}

interface SettlementBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromUser: { id: string; name: string; imageUrl?: string };
  toUser: { id: string; name: string; imageUrl?: string };
  totalAmount: number;
  status: "pending" | "paid";
  contributingExpenses: SettlementExpense[];
  reverseExpenses?: SettlementExpense[];  // Expenses in reverse direction (offset)
  grossOwed?: number;                      // Total before netting
  grossOffset?: number;                    // Amount offset (subtracted)
  currentUserId: string;
  onUploadProof?: () => void;
  onMarkAllPaid?: () => void;
  onSendReminder?: () => void;
  onViewQR?: () => void;
}

export function SettlementBreakdownModal({
  open,
  onOpenChange,
  fromUser,
  toUser,
  totalAmount,
  status,
  contributingExpenses,
  reverseExpenses = [],
  grossOwed,
  grossOffset,
  currentUserId,
  onUploadProof,
  onMarkAllPaid,
  onSendReminder,
  onViewQR,
}: SettlementBreakdownModalProps) {
  const isViewerOwing = fromUser.id === currentUserId;
  const isViewerReceiving = toUser.id === currentUserId;
  const hasReceipts = contributingExpenses.some(e => e.status === "submitted");
  
  const getStatusBadge = (expenseStatus: SettlementExpense["status"]) => {
    switch (expenseStatus) {
      case "pending":
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
            Pending
          </span>
        );
      case "submitted":
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Pending Verification
          </span>
        );
      case "settled":
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stat-green/10 text-stat-green">
            Settled
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="flex-none p-4 pb-4 border-b border-border/50">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* From → To Visual */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {/* From User */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-border">
                {fromUser.imageUrl ? (
                  <img src={fromUser.imageUrl} alt={fromUser.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-semibold text-muted-foreground">
                    {fromUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">{fromUser.name}</span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* To User */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-primary/50">
                {toUser.imageUrl ? (
                  <img src={toUser.imageUrl} alt={toUser.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-semibold text-muted-foreground">
                    {toUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">{toUser.name}</span>
            </div>
          </div>

          {/* Total Amount */}
          <DialogTitle className="text-center mt-3">
            <span className="text-muted-foreground text-sm font-normal">Total Outstanding</span>
            <span className="block text-2xl font-bold text-foreground mt-0.5">
              RM {totalAmount.toLocaleString()}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Body - Expense Breakdown List */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide p-4 space-y-4">
          {/* Section: What fromUser owes toUser */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {fromUser.name.split(' ')[0]} owes {toUser.name.split(' ')[0]}
            </h3>

            {contributingExpenses.length > 0 ? (
              <div className="space-y-2">
                {contributingExpenses.map((expense) => {
                  const categoryData = getCategoryById(expense.category);
                  return (
                    <Card key={expense.expenseId} className="p-3 border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-base">{categoryData.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">
                                {expense.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDate(expense.date)}
                              </p>
                            </div>
                            <p className="font-semibold text-foreground text-sm shrink-0">
                              RM {expense.shareAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-2">
                            {getStatusBadge(expense.status)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {grossOwed !== undefined && (
                  <div className="flex justify-between items-center pt-2 px-1">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">RM {grossOwed.toFixed(2)}</span>
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-4 text-center border-border/50">
                <p className="text-sm text-muted-foreground">No expenses</p>
              </Card>
            )}
          </div>

          {/* Section: Offset (reverse direction) */}
          {reverseExpenses.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Less: {toUser.name.split(' ')[0]} owes {fromUser.name.split(' ')[0]}
              </h3>
              <div className="space-y-2">
                {reverseExpenses.map((expense) => {
                  const categoryData = getCategoryById(expense.category);
                  return (
                    <Card key={expense.expenseId} className="p-3 border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-base">{categoryData.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">
                                {expense.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDate(expense.date)}
                              </p>
                            </div>
                            <p className="font-semibold text-stat-red text-sm shrink-0">
                              -RM {expense.shareAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-2">
                            {getStatusBadge(expense.status)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {grossOffset !== undefined && (
                  <div className="flex justify-between items-center pt-2 px-1">
                    <span className="text-sm text-muted-foreground">Offset</span>
                    <span className="font-semibold text-stat-red">-RM {grossOffset.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="flex-none p-4 pt-3 border-t border-border/50 space-y-3">
          {/* Total Confirmation */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-foreground text-lg">RM {totalAmount.toLocaleString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Primary Action */}
            {status === "pending" && (
              isViewerOwing ? (
                <Button 
                  className="w-full h-11 text-sm bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => {
                    onUploadProof?.();
                    onOpenChange(false);
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Payment Proof
                </Button>
              ) : isViewerReceiving ? (
                <Button 
                  className="w-full h-11 text-sm bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => {
                    onMarkAllPaid?.();
                    onOpenChange(false);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark All as Paid
                </Button>
              ) : null
            )}

            {/* Secondary Actions */}
            <div className="flex gap-2">
              {isViewerReceiving && status === "pending" && (
                <Button 
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                  onClick={() => {
                    onSendReminder?.();
                    onOpenChange(false);
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Remind
                </Button>
              )}
              
              {isViewerOwing && (
                <Button 
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                  onClick={() => {
                    onViewQR?.();
                    onOpenChange(false);
                  }}
                >
                  View QR
                </Button>
              )}

              {hasReceipts && (
                <Button 
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                  onClick={() => onOpenChange(false)}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  View Receipts
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
