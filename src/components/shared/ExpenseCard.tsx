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
    <Card className="p-4 border-border/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground">Paid by {paidBy}</p>
            </div>
            <span className="text-lg font-bold text-foreground">
              {currency} {amount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{date}</span>
            {hasReceipt && (
              <button
                onClick={onViewReceipt}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Receipt className="h-3.5 w-3.5" />
                View receipt
              </button>
            )}
          </div>

          {paymentProgress > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Payment Progress</span>
                <span className="text-primary font-medium">{paymentProgress}% paid</span>
              </div>
              <Progress value={paymentProgress} className="h-1.5" />
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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