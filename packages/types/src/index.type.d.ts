import "./logger/pino-roll";

/**
 * Represents an array with a fixed length, ensuring it is not empty if length > 0.
 * @template T - The type of elements in the array.
 * @template N - The fixed length of the array (must be a positive number).
 * @example
 * ```ts
 * const arr: LimitedArray<string, 2> = ["a", "b"]; // Valid: ["string", "string"]
 * const arr2: LimitedArray<string, 3> = ["a", "b", "c"]; // Valid: ["string", "string", "string"]
 * const arr3: LimitedArray<string, 0> = []; // Valid: []
 * ```
 */
export type LimitedArray<T, N extends number> = N extends 0 ? [] : Tuple<T, N>;

/**
 * Creates a tuple of fixed length using recursion.
 * @template T - The type of elements in the tuple.
 * @template N - The desired length (must be a non-negative number).
 * @returns A tuple of type [T, T, ..., T] with length N.
 * @example
 * ```ts
 * type SomeArrayType = Tuple<string, 3>; // -> ["string", "string", "string"]
 * ```
 */
type Tuple<T, N extends number, R extends unknown[] = []> = R["length"] extends N
  ? R
  : Tuple<T, N, [...R, T]>;

/**
 * An array that may be empty.
 * @template T - The type of elements in the array.
 */
export type ArrayMaybeEmpty<T> = T[] | [];

/**
 * An array that must contain at least one element.
 * @template T - The type of elements in the array.
 */
export type ArrayNotEmpty<T> = [T, ...T[]];

/**
 * A specific use case for a limited array of non-empty string paths with at least 2 elements.
 * @example
 * ```ts
 * const path: ArrayPathLimit = ["user", "profile"]; // Valid
 * const invalidPath: ArrayPathLimit = ["user"]; // Error: too short
 * ```
 */
export type ArrayPathLimit = LimitedArray<ArrayNotEmpty<string>, 2>;

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
