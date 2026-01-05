import { cn } from "@/lib/utils";
import { currencies, type CurrencyCode } from "@/lib/currencyUtils";

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          type="button"
          onClick={() => onChange(currency.code)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            "border",
            value === currency.code
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
          )}
        >
          {currency.symbol} {currency.code}
        </button>
      ))}
    </div>
  );
}
