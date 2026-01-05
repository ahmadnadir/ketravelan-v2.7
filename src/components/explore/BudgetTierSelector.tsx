import { Slider } from "@/components/ui/slider";
import { convertPrice, formatCurrency, type CurrencyCode } from "@/lib/currencyUtils";

interface BudgetRangeSelectorProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  currency?: CurrencyCode;
}

export function BudgetRangeSelector({ value, onChange, currency = "MYR" }: BudgetRangeSelectorProps) {
  const formatPrice = (priceInMYR: number) => {
    const converted = convertPrice(priceInMYR, currency);
    if (priceInMYR >= 10000) {
      return formatCurrency(converted, currency) + "+";
    }
    return formatCurrency(converted, currency);
  };

  // Generate tick labels based on currency
  const tickValues = [0, 2500, 5000, 7500, 10000];
  const tickLabels = tickValues.map((val) => {
    const converted = convertPrice(val, currency);
    if (val === 10000) {
      return formatCurrency(converted, currency) + "+";
    }
    // Shorten for display
    if (currency === "IDR") {
      if (converted >= 1000000) return `${(converted / 1000000).toFixed(0)}jt`;
      if (converted >= 1000) return `${Math.round(converted / 1000)}k`;
    }
    if (converted >= 1000) {
      return `${(converted / 1000).toFixed(1)}k`.replace(".0k", "k");
    }
    return formatCurrency(converted, currency);
  });

  return (
    <div className="space-y-4">
      {/* Display selected range */}
      <p className="text-sm text-muted-foreground text-center">
        {formatPrice(value[0])} – {formatPrice(value[1])}
      </p>

      {/* Dual-thumb slider */}
      <Slider
        min={0}
        max={10000}
        step={100}
        value={value}
        onValueChange={(val) => onChange([val[0], val[1]])}
        className="py-2"
      />

      {/* Tick labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {tickLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function formatBudgetRange(range: [number, number], currency: CurrencyCode = "MYR"): string {
  const formatPrice = (priceInMYR: number) => {
    const converted = convertPrice(priceInMYR, currency);
    if (priceInMYR >= 10000) {
      return formatCurrency(converted, currency) + "+";
    }
    return formatCurrency(converted, currency);
  };
  return `${formatPrice(range[0])} – ${formatPrice(range[1])}`;
}

export function isDefaultBudgetRange(range: [number, number]): boolean {
  return range[0] === 0 && range[1] === 10000;
}
