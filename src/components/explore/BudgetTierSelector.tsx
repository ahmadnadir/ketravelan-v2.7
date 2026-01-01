import { Slider } from "@/components/ui/slider";

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

const tierToIndex = (tier: BudgetTier): number => {
  const index = budgetTiers.findIndex((t) => t.id === tier);
  return index >= 0 ? index : 0;
};

const indexToTier = (index: number): BudgetTier => {
  return budgetTiers[index]?.id || "any";
};

interface BudgetTierSelectorProps {
  value: BudgetTier;
  onChange: (tier: BudgetTier) => void;
}

export function BudgetTierSelector({ value, onChange }: BudgetTierSelectorProps) {
  const currentTier = budgetTiers.find((t) => t.id === value) || budgetTiers[0];

  return (
    <div className="space-y-4">
      {/* Helper text showing selected tier */}
      <p className="text-sm text-muted-foreground text-center">
        {currentTier.label} — {currentTier.description}
      </p>

      {/* Slider with 4 steps */}
      <Slider
        min={0}
        max={3}
        step={1}
        value={[tierToIndex(value)]}
        onValueChange={(val) => onChange(indexToTier(val[0]))}
        className="py-2"
      />

      {/* Step labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Any</span>
        <span>Budget</span>
        <span>Mid-range</span>
        <span>Comfort</span>
      </div>
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
