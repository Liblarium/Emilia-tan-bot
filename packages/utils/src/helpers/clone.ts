/**
 * Creates a deep clone of an object.
 * @param obj The object to clone.
 * @returns The cloned object.
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 } };
 * const clonedObj = deepClone(obj);
 * console.log(clonedObj); // { a: 1, b: { c: 2 } }
 * ```
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
