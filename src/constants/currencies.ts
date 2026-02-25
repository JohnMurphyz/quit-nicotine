export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'JPY', symbol: '¥' },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? '$';
}
