/**
 * Checks if the given object is a Promise or a thenable.
 * 
 * @param obj - The object to check.
 * @typeParam T - The type of the value that the Promise resolves to.
 * @returns A type predicate indicating whether the object is a Promise<T> or a thenable (boolean).
 */
export function isPromise<T>(obj: unknown): obj is Promise<T> {
  if (!obj) return false;


  if (obj instanceof Promise) return true;

  return (
    typeof obj === "object" &&
    "then" in obj &&
    typeof obj.then === "function"
  );
}
