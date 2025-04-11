
/**
 * Formats a date as a string in the format "DD MMMM YYYY, HH:mm"
 * @param date - Date to format
 * @param locale - Locale to use. Example: "en-US"
 * @returns Formatted date string
 */

export function formatDate(date: Date, locale: string): string {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Delays the execution by a specified number of milliseconds.
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
