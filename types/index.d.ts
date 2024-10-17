/**
 * Type for array that can be empty.
 * @example
 * const arr: ArrayMaybeEmpty<number> = [];
 * const arr2: ArrayMaybeEmpty<number> = [1, 2, 3];
 */
export type ArrayMaybeEmpty<T> = T[] | [];

/**
 * Type for array with limited length.
 * @example
 * const arr: PathArgsLimit<string, 2> = ["a", "b"];
 * const arr2: PathArgsLimit<string, 3> = ["a", "b", "c"];
 */
export type PathArgsLimit<T = string, N extends number = 1> = [T, ...T[]] & { length: N };

/**
 * Type for array that cannot be empty.
 * @example
 * const arr: ArrayNotEmpty<number> = [1];
 * const arr2: ArrayNotEmpty<number> = [1, 2, 3];
 */
export type ArrayNotEmpty<T> = [T, ...T[]] | [T];

/**
 * Type for array with limited length and that cannot be empty.
 * @example
 * const arr: LimitedArrayArgs<number, 2> = [1, 2];
 * const arr2: LimitedArrayArgs<number, 3> = [1, 2, 3];
 */
export type LimitedArrayArgs<T, N extends number = 1> = ArrayNotEmpty<T> & { length: N };

