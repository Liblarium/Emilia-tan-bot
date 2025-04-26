/**
 * Checks if the given value is an object.
 * 
 * @param obj - The value to be checked.
 * @returns A boolean indicating whether the value is an object.
 *          Returns true if the value is an object (excluding null), false otherwise.
 */
export function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === "object";
}
