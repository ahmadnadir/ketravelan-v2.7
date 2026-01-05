import { Coins } from "lucide-react";
import { Label } from "@/components/ui/label";
import { PillChip } from "@/components/shared/PillChip";
import { CurrencyCode, travelCurrencies } from "@/lib/currencyUtils";

interface TravelCurrencyPickerProps {
  selectedCurrencies: CurrencyCode[];
  onSelectionChange: (currencies: CurrencyCode[]) => void;
}

export function TravelCurrencyPicker({
  selectedCurrencies,
  onSelectionChange,
}: TravelCurrencyPickerProps) {
  const toggleCurrency = (code: CurrencyCode) => {
    if (selectedCurrencies.includes(code)) {
      onSelectionChange(selectedCurrencies.filter((c) => c !== code));
    } else {
      onSelectionChange([...selectedCurrencies, code]);
    }
  };

  return (
    <div className="space-y-2 pt-3">
      <Label className="text-xs font-medium flex items-center gap-2">
        <Coins className="h-4 w-4 text-muted-foreground" />
        Travel Currencies
      </Label>
      <p className="text-[11px] text-muted-foreground">
        Select currencies you'll use for expenses on this trip
      </p>
      <div className="flex flex-wrap gap-2">
        {travelCurrencies.map((currency) => (
          <PillChip
            key={currency.code}
            label={`${currency.symbol} ${currency.code}`}
            selected={selectedCurrencies.includes(currency.code)}
            onClick={() => toggleCurrency(currency.code)}
          />
        ))}
      </div>
    </div>
  );
}
