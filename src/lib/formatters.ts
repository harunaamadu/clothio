// Exchange rates relative to USD (update periodically or use a live API)
export const exchangeRates: Record<string, number> = {
  USD: 1.00,
  GBP: 0.79,
  EUR: 0.92,
  JPY: 149.50,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.89,
  CNY: 7.24,
  AED: 3.67,
  GHS: 15.60,
};

export const currencySymbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  CNY: "¥",
  AED: "د.إ",
  GHS: "₵",
};

// Currencies that don't use decimal places
const noDecimalCurrencies = new Set(["JPY"]);

export function convertPrice(
  amountUSD: number,
  targetCurrency: string
): number {
  const rate = exchangeRates[targetCurrency] ?? 1;
  return amountUSD * rate;
}

export function formatPrice(
  amountUSD: number,
  targetCurrency: string = "USD"
): string {
  const converted = convertPrice(amountUSD, targetCurrency);
  const symbol = currencySymbols[targetCurrency] ?? targetCurrency;
  const decimals = noDecimalCurrencies.has(targetCurrency) ? 0 : 2;

  return `${symbol}${converted.toFixed(decimals)}`;
}

// Format an already-converted amount (when you have the raw value)
export function formatConverted(
  amount: number,
  currency: string = "USD"
): string {
  const symbol = currencySymbols[currency] ?? currency;
  const decimals = noDecimalCurrencies.has(currency) ? 0 : 2;
  return `${symbol}${amount.toFixed(decimals)}`;
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(d);
}

export function formatOrderStatus(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
}

export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}