/**
 * Type for array with limited length and that cannot be empty.
 * @example
 * const arr: PathArgsLimit<string, 2> = ["a", "b"];
 * const arr2: PathArgsLimit<string, 3> = ["a", "b", "c"];
 */
export type ArrayPathLimit = PathArgsLimit<string, 2>;

/**
 * Utility types for array handling.
 */

// Type for an array that can be empty.
export type ArrayMaybeEmpty<T> = T[] | [];

/**
 * Type for an array with limited length.
 * 
 * @template T - The type of elements in the array.
 * @template N - The exact length of the array.
 * @example
 * const arr: PathArgsLimit<string, 2> = ["a", "b"]; // Valid
 * const arr2: PathArgsLimit<string, 3> = ["a", "b", "c"]; // Valid
 * const arr3: PathArgsLimit<string, 2> = ["a", "b", "c"]; // Invalid, error
 */
export type PathArgsLimit<T = string, N extends number = 1> = [T, ...T[]] & { length: N };

// Type for an array that cannot be empty.
export type ArrayNotEmpty<T> = [T, ...T[]] | [T];

/**
 * Type for an array with limited length and that cannot be empty.
 * 
 * @template T - The type of elements in the array.
 * @template N - The exact length of the array.
 * @example
 * const arr: LimitedArrayArgs<number, 2> = [1, 2]; // Valid
 * const arr2: LimitedArrayArgs<number, 3> = [1, 2, 3]; // Valid
 * const arr3: LimitedArrayArgs<number, 2> = [1]; // Invalid, error
 */
export type LimitedArrayArgs<T, N extends number = 1> = ArrayNotEmpty<T> & { length: N };