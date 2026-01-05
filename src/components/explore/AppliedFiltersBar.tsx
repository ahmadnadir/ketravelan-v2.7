import { X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { formatBudgetRange, isDefaultBudgetRange } from "./BudgetTierSelector";
import type { TripCategoryId } from "@/data/categories";
import type { CurrencyCode } from "@/lib/currencyUtils";

interface AppliedFiltersBarProps {
  destination: string;
  dates: DateRange | undefined;
  flexibleDates: boolean;
  budgetRange: [number, number];
  categories: TripCategoryId[];
  currency: CurrencyCode;
  onClear: () => void;
  onEdit: () => void;
}

export function AppliedFiltersBar({
  destination,
  dates,
  flexibleDates,
  budgetRange,
  categories,
  currency,
  onClear,
  onEdit,
}: AppliedFiltersBarProps) {
  const hasFilters = destination || dates?.from || flexibleDates || !isDefaultBudgetRange(budgetRange) || categories.length > 0 || currency !== "MYR";

  if (!hasFilters) return null;

  const chips: string[] = [];

  if (destination) {
    chips.push(destination);
  }

  if (flexibleDates) {
    chips.push("Flexible dates");
  } else if (dates?.from) {
    if (dates.to) {
      chips.push(`${format(dates.from, "MMM d")} – ${format(dates.to, "MMM d")}`);
    } else {
      chips.push(format(dates.from, "MMM d"));
    }
  }

  if (!isDefaultBudgetRange(budgetRange)) {
    chips.push(formatBudgetRange(budgetRange, currency));
  }

  if (categories.length > 0) {
    chips.push(`${categories.length} style${categories.length > 1 ? "s" : ""}`);
  }

  if (currency !== "MYR") {
    chips.push(`Currency: ${currency}`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {chips.map((chip, index) => (
        <button
          key={index}
          onClick={onEdit}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-primary/10 text-primary border border-primary/20",
            "hover:bg-primary/15 transition-colors"
          )}
        >
          {chip}
        </button>
      ))}
      <button
        onClick={onClear}
        className="p-1.5 rounded-full hover:bg-secondary transition-colors"
        aria-label="Clear all filters"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
