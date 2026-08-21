/**
 * VendraX Currency & Number Formatter Utility
 * Supports both INR (Lakhs / Crores / ₹) and USD ($)
 */

export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export function formatCurrency(amount: number, currency: CurrencyCode = 'INR', compact: boolean = false): string {
  if (currency === 'INR') {
    if (compact) {
      if (Math.abs(amount) >= 10000000) {
        return `₹${(amount / 10000000).toFixed(1)}Cr`;
      }
      if (Math.abs(amount) >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
      }
      if (Math.abs(amount) >= 1000) {
        return `₹${(amount / 1000).toFixed(1)}k`;
      }
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  if (currency === 'EUR') {
    if (compact) {
      if (Math.abs(amount) >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
      if (Math.abs(amount) >= 1000) return `€${(amount / 1000).toFixed(1)}k`;
    }
    return `€${amount.toLocaleString('en-US')}`;
  }

  // Default USD
  if (compact) {
    if (Math.abs(amount) >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (Math.abs(amount) >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatLakhs(amount: number): string {
  const inLakhs = amount / 100000;
  return `₹${inLakhs % 1 === 0 ? inLakhs.toFixed(0) : inLakhs.toFixed(1)}L`;
}
