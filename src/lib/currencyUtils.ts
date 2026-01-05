export type CurrencyCode = "MYR" | "USD" | "EUR" | "IDR";

export const currencies: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
];

// Approximate conversion rates from MYR
export const conversionRates: Record<CurrencyCode, number> = {
  MYR: 1,
  USD: 0.21,
  EUR: 0.20,
  IDR: 3380,
};

export function convertPrice(priceInMYR: number, toCurrency: CurrencyCode): number {
  return Math.round(priceInMYR * conversionRates[toCurrency]);
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const currencyInfo = currencies.find((c) => c.code === currency);
  const symbol = currencyInfo?.symbol || currency;
  
  if (currency === "IDR") {
    // Format large IDR amounts with 'k' or 'jt' (juta = million)
    if (amount >= 1000000) {
      return `${symbol} ${(amount / 1000000).toFixed(1)}jt`;
    }
    if (amount >= 1000) {
      return `${symbol} ${Math.round(amount / 1000)}k`;
    }
  }
  
  return `${symbol} ${amount.toLocaleString()}`;
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  const currencyInfo = currencies.find((c) => c.code === currency);
  return currencyInfo?.symbol || currency;
}

export function formatBudgetRangeWithCurrency(
  range: [number, number],
  currency: CurrencyCode
): string {
  const formatPrice = (priceInMYR: number) => {
    const converted = convertPrice(priceInMYR, currency);
    if (priceInMYR >= 10000) {
      return formatCurrency(converted, currency) + "+";
    }
    return formatCurrency(converted, currency);
  };
  return `${formatPrice(range[0])} – ${formatPrice(range[1])}`;
}
