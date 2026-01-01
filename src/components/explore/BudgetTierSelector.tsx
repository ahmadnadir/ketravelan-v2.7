import { cn } from "@/lib/utils";

export type BudgetTier = "any" | "budget" | "midrange" | "comfort";

interface BudgetTierOption {
  id: BudgetTier;
  label: string;
  description: string;
  range: [number, number];
}

const budgetTiers: BudgetTierOption[] = [
  { id: "any", label: "Any budget", description: "Show all trips", range: [0, 10000] },
  { id: "budget", label: "Budget", description: "Under RM 1,500", range: [0, 1500] },
  { id: "midrange", label: "Mid-range", description: "RM 1,500 – 3,000", range: [1500, 3000] },
  { id: "comfort", label: "Comfort", description: "RM 3,000+", range: [3000, 10000] },
];

interface BudgetTierSelectorProps {
  value: BudgetTier;
  onChange: (tier: BudgetTier) => void;
}

export function BudgetTierSelector({ value, onChange }: BudgetTierSelectorProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
      {budgetTiers.map((tier) => (
        <button
          key={tier.id}
          type="button"
          onClick={() => onChange(tier.id)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 transition-all",
            value === tier.id
              ? "bg-secondary"
              : "bg-background hover:bg-secondary/50"
          )}
        >
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">
              {tier.label}
            </p>
            <p className="text-xs text-muted-foreground">{tier.description}</p>
          </div>
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
            value === tier.id
              ? "border-primary bg-primary"
              : "border-muted-foreground/40"
          )}>
            {value === tier.id && (
              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export function getBudgetRangeFromTier(tier: BudgetTier): [number, number] {
  const found = budgetTiers.find((t) => t.id === tier);
  return found?.range || [0, 10000];
}

export function getBudgetTierLabel(tier: BudgetTier): string {
  const found = budgetTiers.find((t) => t.id === tier);
  return found?.label || "Any budget";
}
