import { MoreVertical, FileText, Bell, CheckCircle, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryById, getCategoryFromTitle } from "@/lib/expenseCategories";

// User role types for expense actions
type ExpenseRole = "payer" | "owes" | "settled";

interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  currency?: string;
  paidBy: string;
  date: string;
  category?: string;
  paymentProgress?: number;
  currentUser?: string;
  splitWith?: string[];
  // Role-aware callbacks
  onViewDetails: () => void;
  onSendReminder?: () => void;
  onMarkAsReceived?: () => void;
  onUploadProof?: () => void;
  // Management callbacks
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExpenseCard({
  title,
  amount,
  currency = "RM",
  paidBy,
  date,
  category,
  paymentProgress = 0,
  currentUser = "Ahmad",
  onViewDetails,
  onSendReminder,
  onMarkAsReceived,
  onUploadProof,
  onEdit,
  onDelete,
}: ExpenseCardProps) {
  // Get category info - use provided category or derive from title
  const categoryId = category || getCategoryFromTitle(title);
  const categoryInfo = getCategoryById(categoryId);
  const CategoryIcon = categoryInfo.icon;

  // Determine user's role for this expense
  const isFullySettled = paymentProgress === 100;
  const isPayer = paidBy.toLowerCase().includes(currentUser.toLowerCase());
  
  const getExpenseRole = (): ExpenseRole => {
    if (isFullySettled) return "settled";
    if (isPayer) return "payer";
    return "owes";
  };

  const role = getExpenseRole();

  return (
    <Card className="p-3 sm:p-4 border-border/50">
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${categoryInfo.color.split(' ')[0]}`}>
          <CategoryIcon className={`h-5 w-5 ${categoryInfo.color.split(' ')[1]}`} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Header: Title and Amount */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Paid by {paidBy} · {date}
              </p>
            </div>
            <div className="flex items-start gap-1 shrink-0">
              <span className="text-base sm:text-lg font-semibold text-foreground">
                {currency} {amount.toLocaleString()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status Section (Conditional) */}
          {isFullySettled ? (
            <Badge variant="secondary" className="bg-stat-green text-stat-green-foreground gap-1.5">
              <CheckCircle className="h-3 w-3" />
              Fully settled
            </Badge>
          ) : paymentProgress > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Payment progress</span>
                <span className="text-xs font-medium text-primary">{paymentProgress}% settled</span>
              </div>
              <Progress value={paymentProgress} className="h-1.5" />
            </div>
          ) : null}

          {/* Action Area (Role-Aware) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Details - Always shown */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary"
            >
              <FileText className="h-3.5 w-3.5" />
              View Details
            </Button>

            {/* Case A: Others owe me (I paid, waiting for others) */}
            {role === "payer" && (
              <>
                {onSendReminder && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSendReminder}
                    className="h-8 px-3 text-xs gap-1.5 text-primary hover:text-primary bg-primary/10 hover:bg-primary/20"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Send Reminder
                  </Button>
                )}
                {onMarkAsReceived && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAsReceived}
                    className="h-8 px-3 text-xs gap-1.5 text-stat-green hover:text-stat-green bg-stat-green/20 hover:bg-stat-green/30"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Mark as Received
                  </Button>
                )}
              </>
            )}

            {/* Case B: I owe others (someone else paid, I need to pay) */}
            {role === "owes" && onUploadProof && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onUploadProof}
                className="h-8 px-3 text-xs gap-1.5 text-primary hover:text-primary bg-primary/10 hover:bg-primary/20"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Payment Proof
              </Button>
            )}

            {/* Case C: Fully settled - only View Details is shown (handled above) */}
          </div>
        </div>
      </div>
    </Card>
  );
}
