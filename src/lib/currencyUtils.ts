export type CurrencyCode = "MYR" | "USD" | "EUR" | "IDR";

export const currencies: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
];

// Travel currencies only (for expense entry)
export const travelCurrencies = currencies.filter(c => c.code !== "MYR");

// Approximate conversion rates TO MYR (base currency)
// 1 USD = 4.76 MYR, 1 EUR = 5.00 MYR, 1 IDR = 0.000296 MYR
export const conversionRatesToMYR: Record<CurrencyCode, number> = {
  MYR: 1,
  USD: 4.76,
  EUR: 5.00,
  IDR: 0.000296,
};

// Legacy: rates FROM MYR (for backward compatibility)
export const conversionRates: Record<CurrencyCode, number> = {
  MYR: 1,
  USD: 0.21,
  EUR: 0.20,
  IDR: 3380,
};

export interface ConversionResult {
  amount: number;
  rate: number;
  available: boolean;
}

// Convert from any currency to home currency
export function convertToHomeCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  homeCurrency: CurrencyCode
): ConversionResult {
  if (fromCurrency === homeCurrency) {
    return { amount, rate: 1, available: true };
  }
  
  // Convert to MYR first (base), then to home currency
  const amountInMYR = amount * conversionRatesToMYR[fromCurrency];
  const rate = conversionRatesToMYR[fromCurrency] / conversionRatesToMYR[homeCurrency];
  const convertedAmount = amount * rate;
  
  return {
    amount: Math.round(convertedAmount * 100) / 100,
    rate,
    available: true,
  };
}

// Format currency with proper spacing: "RM 5,000" not "RM5,000"
export function formatCurrencySpaced(amount: number, currency: CurrencyCode): string {
  const currencyInfo = currencies.find((c) => c.code === currency);
  const symbol = currencyInfo?.symbol || currency;
  
  if (currency === "IDR") {
    if (amount >= 1000000) {
      return `${symbol} ${(amount / 1000000).toFixed(1)}jt`;
    }
    if (amount >= 1000) {
      return `${symbol} ${Math.round(amount / 1000)}k`;
    }
  }
  
  return `${symbol} ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

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

// Destination to currency mapping for auto-suggestion
const destinationCurrencyMap: Record<string, CurrencyCode> = {
  // Indonesia
  'indonesia': 'IDR',
  'bali': 'IDR',
  'jakarta': 'IDR',
  'lombok': 'IDR',
  'yogyakarta': 'IDR',
  'bandung': 'IDR',
  'surabaya': 'IDR',
  
  // USA
  'united states': 'USD',
  'usa': 'USD',
  'america': 'USD',
  'new york': 'USD',
  'california': 'USD',
  'hawaii': 'USD',
  'los angeles': 'USD',
  'san francisco': 'USD',
  'las vegas': 'USD',
  
  // Europe (Eurozone)
  'europe': 'EUR',
  'france': 'EUR',
  'paris': 'EUR',
  'germany': 'EUR',
  'berlin': 'EUR',
  'spain': 'EUR',
  'barcelona': 'EUR',
  'madrid': 'EUR',
  'italy': 'EUR',
  'rome': 'EUR',
  'milan': 'EUR',
  'amsterdam': 'EUR',
  'netherlands': 'EUR',
  'belgium': 'EUR',
  'brussels': 'EUR',
  'portugal': 'EUR',
  'lisbon': 'EUR',
  'greece': 'EUR',
  'athens': 'EUR',
  'austria': 'EUR',
  'vienna': 'EUR',
  
  // Malaysia (home country)
  'malaysia': 'MYR',
  'kuala lumpur': 'MYR',
  'langkawi': 'MYR',
  'penang': 'MYR',
  'malacca': 'MYR',
  'kota kinabalu': 'MYR',
};

export function suggestCurrencyFromDestination(destination: string): CurrencyCode | null {
  if (!destination) return null;
  
  const normalized = destination.toLowerCase().trim();
  for (const [key, currency] of Object.entries(destinationCurrencyMap)) {
    if (normalized.includes(key)) {
      return currency;
    }
  }
  return null;
}
