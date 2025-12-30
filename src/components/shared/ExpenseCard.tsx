import { MoreVertical } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  // Interaction callbacks
  onCardClick: () => void;
  onPrimaryAction: () => void;
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
  onCardClick,
  onPrimaryAction,
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

  // Handle card click (not on button or dropdown)
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't trigger card click if clicking on buttons or dropdown
    if (target.closest('button') || target.closest('[role="menu"]')) {
      return;
    }
    onCardClick();
  };

  return (
    <Card 
      className="group p-3 sm:p-4 border-border/50 cursor-pointer hover:bg-secondary/20 hover:shadow-md transition-all duration-150"
      onClick={handleCardClick}
    >
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 -mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status Section - Always show progress bar when there's progress */}
          {paymentProgress > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isFullySettled ? "text-stat-green font-medium" : "text-muted-foreground"}`}>
                  {paymentProgress}% settled
                </span>
              </div>
              <Progress value={paymentProgress} className="h-1.5" />
            </div>
          )}

          {/* Primary Action Button - Always visible */}
          <div className="pt-3">
            <Button
              variant={role === "settled" ? "ghost" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                role === "settled" ? onCardClick() : onPrimaryAction();
              }}
              className={cn(
                "w-full h-9 text-xs font-medium transition-all duration-150",
                role === "settled" 
                  ? "text-muted-foreground hover:bg-secondary/50" 
                  : "border-border/60 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
              )}
            >
              {role === "payer" ? "View Payments" : role === "owes" ? "Mark as Paid" : "View Details"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
