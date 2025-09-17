/**
 * Utility function to format numbers in a readable format
 * Examples: 1000 -> "1k", 1500 -> "1.5k", 1000000 -> "1M"
 */
export function formatNumber(num: number | string): string {
  // Convert string to number if needed
  const numValue = typeof num === 'string' ? parseFloat(num) : num
  
  // Handle invalid numbers
  if (isNaN(numValue)) {
    return '0'
  }
  
  // Format based on magnitude
  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  
  return numValue.toString()
}

/**
 * Format currency with Taka symbol
 */
export function formatCurrency(num: number | string): string {
  return `৳${formatNumber(num)}`
}

export default formatNumber
