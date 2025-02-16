/**
 * Check if object is a class
 * @param {unknown} obj - object to check
 * @returns {boolean} - true if class, false otherwise
 */
export const isClass = (obj: unknown): boolean =>
  typeof obj === "function" && /^\s*class\s+/.test(obj.toString());