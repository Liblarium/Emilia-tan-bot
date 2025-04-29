/**
 * A type guard that casts the given value to type T.
 * Useful when you know the type of the value, but TypeScript does not.
 * @example
 * const foo: unknown = 'bar';
 * const bar = setType<string>(foo);
 * // bar is now known to be of type string
 */
export function setType<T>(value: unknown): T {
  return value as T;
}
