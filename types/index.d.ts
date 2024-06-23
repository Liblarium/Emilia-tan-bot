export type ArrayMaybeEmpty<T> = T[] | [];
export type PathArgsLimit<T, N extends number> = [T, ...T[]] & { length: N };
export type ArrayNotEmpty<T> = [T, ...T[]] | [T];
export type LimitedArrayArgs<T, N extends number = 1> = ArrayNotEmpty<T> & { length: N };
