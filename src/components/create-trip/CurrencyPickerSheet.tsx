import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CurrencyCode, travelCurrencies } from "@/lib/currencyUtils";
import { cn } from "@/lib/utils";

interface CurrencyPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCurrencies: CurrencyCode[];
  onToggleCurrency: (code: CurrencyCode) => void;
  suggestedCurrency?: CurrencyCode | null;
}

export function CurrencyPickerSheet({
  open,
  onOpenChange,
  selectedCurrencies,
  onToggleCurrency,
  suggestedCurrency,
}: CurrencyPickerSheetProps) {
  const [search, setSearch] = useState("");

  const filteredCurrencies = useMemo(() => {
    if (!search.trim()) return travelCurrencies;
    const query = search.toLowerCase();
    return travelCurrencies.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.symbol.includes(query)
    );
  }, [search]);

  const handleSelect = (code: CurrencyCode) => {
    onToggleCurrency(code);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl h-[70vh]">
        <SheetHeader className="text-left pb-4">
          <SheetTitle>Add Travel Currency</SheetTitle>
        </SheetHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search currencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="overflow-y-auto flex-1 -mx-6 px-6" style={{ maxHeight: "calc(70vh - 140px)" }}>
          <div className="space-y-1">
            {filteredCurrencies.map((currency) => {
              const isSelected = selectedCurrencies.includes(currency.code);
              const isSuggested = currency.code === suggestedCurrency;

              return (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency.code)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-lg font-medium">{currency.symbol}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.code}</span>
                        {isSuggested && !isSelected && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                            Suggested
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {currency.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}

            {filteredCurrencies.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No currencies found
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
