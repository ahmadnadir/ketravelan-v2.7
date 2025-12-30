import { Receipt, MoreVertical, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryById, getCategoryFromTitle } from "@/lib/expenseCategories";

interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  currency?: string;
  paidBy: string;
  date: string;
  category?: string;
  hasReceipt?: boolean;
  paymentProgress?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewReceipt?: () => void;
  onViewDetails?: () => void;
}

export function ExpenseCard({
  title,
  amount,
  currency = "RM",
  paidBy,
  date,
  category,
  hasReceipt,
  paymentProgress = 0,
  onEdit,
  onDelete,
  onViewReceipt,
  onViewDetails,
}: ExpenseCardProps) {
  // Get category info - use provided category or derive from title
  const categoryId = category || getCategoryFromTitle(title);
  const categoryInfo = getCategoryById(categoryId);
  const CategoryIcon = categoryInfo.icon;

  return (
    <Card className="p-3 sm:p-4 border-border/50">
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${categoryInfo.color.split(' ')[0]}`}>
          <CategoryIcon className={`h-5 w-5 ${categoryInfo.color.split(' ')[1]}`} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Title and Amount Row */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {hasReceipt && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewReceipt}
                className="h-8 px-3 text-xs gap-1.5 text-primary hover:text-primary bg-primary/10 hover:bg-primary/20"
              >
                <Receipt className="h-3.5 w-3.5" />
                View Receipt
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary"
            >
              <FileText className="h-3.5 w-3.5" />
              View Details
            </Button>
          </div>

          {/* Payment Progress */}
          {paymentProgress > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Payment Progress</span>
                <span className="text-xs font-medium text-primary">{paymentProgress}% paid</span>
              </div>
              <Progress value={paymentProgress} className="h-1.5" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
