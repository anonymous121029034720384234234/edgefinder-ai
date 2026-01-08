/**
 * Format a number to 2 decimal places with proper handling
 * Stores full precision in database, displays with 2 decimal places
 */
export function formatPrice(value: any): string {
  const num = Number(value)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

/**
 * Format currency with $ sign
 */
export function formatCurrency(value: any): string {
  return `$${formatPrice(value)}`
}

/**
 * Format number with or without decimal places
 */
export function formatNumber(value: any, decimals: number = 2): string {
  const num = Number(value)
  if (isNaN(num)) return '0'
  return num.toFixed(decimals)
}
