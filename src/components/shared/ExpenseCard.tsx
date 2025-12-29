import { Receipt, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpenseCardProps {
  id: string;
  title: string;
  amount: number;
  currency?: string;
  paidBy: string;
  date: string;
  hasReceipt?: boolean;
  paymentProgress?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewReceipt?: () => void;
}

export function ExpenseCard({
  title,
  amount,
  currency = "RM",
  paidBy,
  date,
  hasReceipt,
  paymentProgress = 0,
  onEdit,
  onDelete,
  onViewReceipt,
}: ExpenseCardProps) {
  return (
    <Card className="p-3 sm:p-4 border-border/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          {/* Title and Amount Row */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm sm:text-base text-foreground">{title}</h4>
            <span className="text-base sm:text-lg font-semibold text-foreground shrink-0">
              {currency} {amount.toLocaleString()}
            </span>
          </div>

          {/* Meta Row - Paid by and Date */}
          <p className="text-xs sm:text-sm text-muted-foreground">
            Paid by {paidBy} · {date}
          </p>

          {/* Receipt Button */}
          {hasReceipt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewReceipt}
              className="h-7 px-2.5 text-xs gap-1.5 text-primary hover:text-primary"
            >
              <Receipt className="h-3.5 w-3.5" />
              View receipt
            </Button>
          )}

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mt-1">
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
    </Card>
  );
}
