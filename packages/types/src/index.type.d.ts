import "./logger/pino-roll";

/**
 * Type for array with limited length and that cannot be empty.
 * @example
 * ```ts
 * const arr: LimitedArray<string, 2> = ["a", "b"]; // [string, string]
 * const arr2: LimitedArray<string, 3> = ["a", "b", "c"]; // [string, string, string]
 * const arr3: LimitedArray<string, 2 | 3> = ["a", "b"]; // [string, string, (string | undefined)]
 * ```
 */
export type ArrayPathLimit = LimitedArray<ArrayNotEmpty<string>, string, 2>;

/**
 * Utility types for array handling.
 */

/**
 * Maybe this array is empty
 *
 * @template T - The type of the elements in the array
 */
export type ArrayMaybeEmpty<T> = T[] | [];

/**
 * This array should have at least 1 Element
 *
 * @template T - The type of the elements in the array
 */
export type ArrayNotEmpty<T> = [T, ...T[]] | [T];

/**
 * It's a limit array that doesn't give you a whine than you pointed in the type
 *
 * @template T - The type of the elements in the array
 * @template K - The type of the elements in the array
 * @template TLength - The length of the array (default: 1)
 */
export type LimitedArray<
  T extends ArrayMaybeEmpty<K> | ArrayNotEmpty<K> | Array<K>,
  K,
  TLength extends number = 1,
> = Tuple<T[number], TLength>;

/**
 * Create a tuple
 *
 * @template T - The type of the elements in the tuple
 * @template N - The length of the tuple
 * @template R - The tuple
 *
 * @returns {R}
 *
 * @example
 * ```ts
 * type SomeArrayType = Tuple<string, 3>;
 * // -> ['string', 'string', 'string']
 * ```
 */
type Tuple<T, N extends number, R extends T[] = []> = R["length"] extends N
  ? R
  : Tuple<T, N, [...R, T]>;

/**
 * Type for a key of an object
 */
export type Keyof<T> = keyof T;

/**
 * Result of reading a JSON file
 *
 * @template T - The type of the JSON object
 */
export type ReadJSONFileResult<T extends object = object> = T | { error: string };

export type LineType = { news: "" | "\n"; last: "" | "\n" };

export * from "./logger";
