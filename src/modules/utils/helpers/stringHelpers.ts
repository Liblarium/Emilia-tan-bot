/**
 * Truncates a given string to a specified length, adding an ellipsis to the end
 * if the string exceeds the length.
 * @param str - The string to truncate
 * @param length - The maximum length of the string
 * @returns A string that is at most `length` characters long, with an ellipsis
 *   appended if the string was truncated
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

/**
 * Formats a given number according to a specified locale.
 * @param num - The number to format
 * @param locale - The locale to use for formatting. Example: "en-US"
 * @returns A string representation of the number, formatted according to the
 *   specified locale
 */
export function formatNumber(num: number, locale: string): string {
  return num.toLocaleString(locale);
}

/**
 * Checks if a given string is a valid URL.
 * @param str - The string to check
 * @returns true if the string is a valid URL, false otherwise
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a given string to camel case.
 * @param str - The string to convert
 * @returns The given string in camel case
 */
export function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Zа-яА-Я0-9]+(.)/g, (_, chr: string): string => chr.toUpperCase());
}

/**
 * Converts a file size in bytes to a human-readable string format.
 * @param bytes - The file size in bytes to format.
 * @returns A string representing the file size in the largest possible unit 
 *   (Bytes, KB, MB, GB, or TB), rounded to the nearest integer.
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
}