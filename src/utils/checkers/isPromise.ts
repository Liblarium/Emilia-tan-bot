/**
 * Checks if the given object is a Promise.
 * 
 * @param obj - The object to check.
 * @typeParam T - The type of the value that the Promise resolves to.
 * @returns A type predicate indicating whether the object is a Promise<T> (boolean).
 */
export function isPromise<T>(obj: unknown): obj is Promise<T> {
  return obj instanceof Promise || (obj !== null && typeof obj === "object" && "then" in obj);
}

